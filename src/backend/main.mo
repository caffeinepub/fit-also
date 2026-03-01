import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";


import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";
import Blob "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";


actor {
  // Types
  type FontWeight = {
    #light;
    #normal;
    #bold;
  };

  type TextStyle = {
    font : Text;
    size : Nat;
    weight : FontWeight;
    color : Text;
  };

  type ColorScheme = {
    primary : Text;
    secondary : Text;
    accent : Text;
    background : Text;
    text : Text;
  };

  type ButtonStyle = {
    background : Text;
    borderRadius : Nat;
    padding : Text;
    text : TextStyle;
  };

  type AppStyle = {
    colors : ColorScheme;
    fonts : {
      heading : TextStyle;
      body : TextStyle;
    };
    buttons : {
      primary : ButtonStyle;
      secondary : ButtonStyle;
    };
    backgroundImage : ?Blob.ExternalBlob;
  };

  type PlatformConfig = {
    products : [Product];
    fabrics : [Fabric];
    colors : [Color];
    workTypes : [WorkType];
    cities : [City];
    promotions : [Promotion];
    banners : [Blob.ExternalBlob];
  };

  type Product = {
    id : Text;
    title : Text;
    category : Text;
    description : Text;
    price : Float;
    image : Blob.ExternalBlob;
    tailorId : Text;
    customizationOptions : CustomizationOptions;
    isDeleted : Bool;
  };

  type CustomizationOptions = {
    neckStyles : [Text];
    sleeveStyles : [Text];
    fabricTypes : [Text];
    colorPatterns : [Text];
    workTypes : [Text];
  };

  type Fabric = {
    id : Text;
    name : Text;
    image : ?Blob.ExternalBlob;
  };

  type Color = {
    id : Text;
    name : Text;
    image : ?Blob.ExternalBlob;
  };

  type WorkType = {
    id : Text;
    name : Text;
    image : ?Blob.ExternalBlob;
  };

  type City = {
    id : Text;
    name : Text;
  };

  type Promotion = {
    id : Text;
    title : Text;
    description : Text;
    discountType : {
      #percentage : Nat;
      #flat : Nat;
    };
    discountValue : Nat;
    applicableCategories : [Text];
    validFrom : Int;
    validUntil : Int;
    active : Bool;
  };

  type Notification = {
    id : Text;
    title : Text;
    body : Text;
    targetAudience : {
      #all;
      #customers;
      #tailors;
    };
    timestamp : Int;
  };

  type Measurement = {
    name : Text;
    value : Float;
  };

  type MeasurementInput = {
    name : Text;
    value : Float;
  };

  type UserProfileV2 = {
    name : Text;
    phoneNumber : Text;
    city : Text;
    preferredLanguage : Text;
    measurements : [Measurement];
    measurementsJson : Text;
    role : Text;
  };

  type UserProfileInput = {
    name : Text;
    phoneNumber : Text;
    city : Text;
    preferredLanguage : Text;
    measurements : [MeasurementInput];
    measurementsJson : Text;
    role : Text;
  };

  type Order = {
    id : Text;
    customerPrincipal : Text;
    tailorId : Text;
    listingTitle : Text;
    category : Text;
    totalPrice : Float;
    orderDate : Int;
    status : Text;
    estimatedDeliveryDate : Text;
    adminNotes : Text;
    customizationJson : Text;
    measurementsJson : Text;
  };

  type DeliveryAddress = {
    houseNo : Text;
    area : Text;
    city : Text;
    state : Text;
    pinCode : Text;
  };

  type ExtendedOrder = {
    id : Text;
    customerPrincipal : Text;
    tailorId : Text;
    listingTitle : Text;
    category : Text;
    totalPrice : Float;
    orderDate : Int;
    status : Text;
    estimatedDeliveryDate : Text;
    adminNotes : Text;
    customizationJson : Text;
    measurementsJson : Text;
    customerName : Text;
    customerPhone : Text;
    customerAltPhone : Text;
    deliveryAddress : DeliveryAddress;
    paymentMode : Text;
    orderHash : Text;
    isDeleted : Bool;
    productImages : [Text];
  };

  type TailorProfile = {
    id : Text;
    shopName : Text;
    ownerName : Text;
    city : Text;
    bio : Text;
    specialties : Text;
    basePricing : Float;
    turnaroundDays : Nat;
    isPremium : Bool;
    contactPhone : Text;
    contactEmail : Text;
    profileImageUrl : Text;
    portfolioJson : Text;
  };

  type CartItem = {
    productId : Text;
    productTitle : Text;
    category : Text;
    price : Float;
    imageUrl : Text;
    quantity : Nat;
    customizationJson : Text;
    selectedColor : Text;
    selectedSize : Text;
  };

  type CoinLedger = {
    userId : Text;
    amount : Int;
    reason : Text;
    timestamp : Int;
  };

  // State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let approvalState = UserApproval.initState(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfileV2>();
  let extendedOrders = Map.empty<Text, ExtendedOrder>();
  let tailorProfiles = Map.empty<Text, TailorProfile>();
  let carts = Map.empty<Principal, List.List<CartItem>>();
  let coinLedgers = Map.empty<Text, List.List<CoinLedger>>();
  var platformConfig : ?PlatformConfig = null;
  let notifications = List.empty<Notification>();

  // Approval Checks - Required
  public query ({ caller }) func isCallerApproved() : async Bool {
    if (AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller)) { true } else {
      false;
    };
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  // User Profile Management
  public shared ({ caller }) func saveUserProfile(profileInput : UserProfileInput) : async () {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };

    let measurements = profileInput.measurements.map(
      func(m) {
        {
          name = m.name;
          value = m.value;
        };
      }
    );

    let userProfile : UserProfileV2 = {
      name = profileInput.name;
      phoneNumber = profileInput.phoneNumber;
      city = profileInput.city;
      preferredLanguage = profileInput.preferredLanguage;
      measurements;
      measurementsJson = profileInput.measurementsJson;
      role = profileInput.role;
    };

    userProfiles.add(caller, userProfile);
  };

  public query ({ caller }) func getUserProfile() : async ?UserProfileV2 {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };
    userProfiles.get(caller);
  };

  // Frontend compatibility functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfileV2 {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profileInput : UserProfileInput) : async () {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };

    let measurements = profileInput.measurements.map(
      func(m) {
        {
          name = m.name;
          value = m.value;
        };
      }
    );

    let userProfile : UserProfileV2 = {
      name = profileInput.name;
      phoneNumber = profileInput.phoneNumber;
      city = profileInput.city;
      preferredLanguage = profileInput.preferredLanguage;
      measurements;
      measurementsJson = profileInput.measurementsJson;
      role = profileInput.role;
    };

    userProfiles.add(caller, userProfile);
  };

  public query ({ caller }) func getUserProfileByPrincipal(user : Principal) : async ?UserProfileV2 {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    userProfiles.get(user);
  };

  // Platform Config Management
  public query ({ caller }) func getPlatformConfig() : async ?PlatformConfig {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };
    platformConfig;
  };

  public shared ({ caller }) func updatePlatformConfig(config : PlatformConfig) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    platformConfig := ?config;
  };

  // Notification Management
  public shared ({ caller }) func createNotification(notification : Notification) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    notifications.add(notification);
  };

  public query ({ caller }) func getNotifications(sinceTimestamp : Int) : async [Notification] {
    notifications.filter(
      func(n) { n.timestamp > sinceTimestamp }
    ).toArray();
  };

  // Orders Management
  public shared ({ caller }) func placeExtendedOrder(order : ExtendedOrder) : async Text {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };

    extendedOrders.add(order.id, order);
    order.id;
  };

  public query ({ caller }) func getMyExtendedOrders() : async [ExtendedOrder] {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };

    let principalText = caller.toText();
    extendedOrders.filter(
      func(_k, o) { o.customerPrincipal == principalText and not o.isDeleted }
    ).values().toArray();
  };

  public query ({ caller }) func getAllExtendedOrders() : async [ExtendedOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    extendedOrders.filter(
      func(_k, o) { not o.isDeleted }
    ).values().toArray();
  };

  public query ({ caller }) func getOrderById(orderId : Text) : async ?ExtendedOrder {
    switch (extendedOrders.get(orderId)) {
      case (null) { null };
      case (?order) {
        if (order.customerPrincipal == caller.toText() or (AccessControl.hasPermission(accessControlState, caller, #admin))) {
          ?order;
        } else {
          Runtime.trap("Unauthorized: Cannot access this order");
        };
      };
    };
  };

  public shared ({ caller }) func cancelOrder(orderId : Text) : async () {
    switch (extendedOrders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (order.customerPrincipal != caller.toText()) {
          Runtime.trap("Unauthorized: Not the order owner");
        };
        if ((order.status != "Order Placed" and order.status != "Confirmed")) {
          Runtime.trap("Cannot cancel this order stage");
        };
        let updatedOrder = {
          order with status = "Cancelled";
        };
        extendedOrders.add(orderId, updatedOrder);
      };
    };
  };

  public shared ({ caller }) func updateExtendedOrderStatus(orderId : Text, newStatus : Text, adminNote : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (extendedOrders.get(orderId)) {
      case (null) {
        Runtime.trap("Order not found");
      };
      case (?order) {
        let updatedOrder = {
          order with
          status = newStatus;
          adminNotes = adminNote;
        };
        extendedOrders.add(orderId, updatedOrder);

        // Create notification for customer
        let notification : Notification = {
          id = orderId # "-status";
          title = "Order Status Updated";
          body = "Your order status was changed to: " # newStatus;
          targetAudience = #customers;
          timestamp = Time.now();
        };
        notifications.add(notification);
      };
    };
  };

  // Shopping Cart Management
  public shared ({ caller }) func addToCart(item : CartItem) : async () {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };
    let existingCart = switch (carts.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?list) { list };
    };
    existingCart.add(item);
    carts.add(caller, existingCart);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?list) { list.toArray() };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };
    carts.remove(caller);
  };

  public shared ({ caller }) func removeFromCart(productId : Text) : async () {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };
    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) {
        let filteredCart = cart.reverse().filter(
          func(item) { item.productId != productId }
        );
        carts.add(caller, filteredCart);
      };
    };
  };

  // Coin Ledger (Placeholder implementation)
  public query ({ caller }) func getUserCoinBalance() : async Int {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };
    0;
  };

  public query ({ caller }) func getCoinHistory() : async [CoinLedger] {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };
    [];
  };

  public query ({ caller }) func getLastUpdateTimestamp() : async Int {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };
    Time.now();
  };

  public shared ({ caller }) func adminDeleteProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (platformConfig) {
      case (null) { Runtime.trap("Platform config not found") };
      case (?config) {
        let updatedProducts = config.products.map(
          func(p) {
            if (p.id == productId) {
              { p with isDeleted = true };
            } else {
              p;
            };
          }
        );
        let updatedConfig = {
          config with products = updatedProducts;
        };
        platformConfig := ?updatedConfig;
      };
    };
  };

  public shared ({ caller }) func adminUpdateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (platformConfig) {
      case (null) { Runtime.trap("Platform config not found") };
      case (?config) {
        let filteredProducts = config.products.filter(
          func(p) { p.id != product.id }
        );
        let updatedProducts = filteredProducts.concat([product]);
        let updatedConfig = {
          config with products = updatedProducts;
        };
        platformConfig := ?updatedConfig;
      };
    };
  };

  public shared ({ caller }) func adminAddProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (platformConfig) {
      case (null) { Runtime.trap("Platform config not found") };
      case (?config) {
        let updatedProducts = config.products.concat([product]);
        let updatedConfig = {
          config with products = updatedProducts;
        };
        platformConfig := ?updatedConfig;
      };
    };
  };

  public shared ({ caller }) func adminAddFabric(fabric : Fabric) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (platformConfig) {
      case (null) { Runtime.trap("Platform config not found") };
      case (?config) {
        let updatedFabrics = config.fabrics.concat([fabric]);
        let updatedConfig = {
          config with fabrics = updatedFabrics;
        };
        platformConfig := ?updatedConfig;
      };
    };
  };

  public shared ({ caller }) func adminAddColor(color : Color) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (platformConfig) {
      case (null) { Runtime.trap("Platform config not found") };
      case (?config) {
        let updatedColors = config.colors.concat([color]);
        let updatedConfig = {
          config with colors = updatedColors;
        };
        platformConfig := ?updatedConfig;
      };
    };
  };

  public shared ({ caller }) func adminAddWorkType(workType : WorkType) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (platformConfig) {
      case (null) { Runtime.trap("Platform config not found") };
      case (?config) {
        let updatedWorkTypes = config.workTypes.concat([workType]);
        let updatedConfig = {
          config with workTypes = updatedWorkTypes;
        };
        platformConfig := ?updatedConfig;
      };
    };
  };

  public shared ({ caller }) func adminDeleteFabric(fabricId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (platformConfig) {
      case (null) { Runtime.trap("Platform config not found") };
      case (?config) {
        let filteredFabrics = config.fabrics.filter(
          func(f) { f.id != fabricId }
        );
        let updatedConfig = {
          config with fabrics = filteredFabrics;
        };
        platformConfig := ?updatedConfig;
      };
    };
  };

  public shared ({ caller }) func adminDeleteColor(colorId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (platformConfig) {
      case (null) { Runtime.trap("Platform config not found") };
      case (?config) {
        let filteredColors = config.colors.filter(
          func(c) { c.id != colorId }
        );
        let updatedConfig = {
          config with colors = filteredColors;
        };
        platformConfig := ?updatedConfig;
      };
    };
  };

  public shared ({ caller }) func adminDeleteWorkType(workTypeId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (platformConfig) {
      case (null) { Runtime.trap("Platform config not found") };
      case (?config) {
        let filteredWorkTypes = config.workTypes.filter(
          func(wt) { wt.id != workTypeId }
        );
        let updatedConfig = {
          config with workTypes = filteredWorkTypes;
        };
        platformConfig := ?updatedConfig;
      };
    };
  };

  // Tailor Profile Management
  public shared ({ caller }) func saveTailorProfile(profile : TailorProfile) : async () {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };
    tailorProfiles.add(profile.id, profile);
  };

  public query ({ caller }) func getTailorProfile(tailorId : Text) : async ?TailorProfile {
    tailorProfiles.get(tailorId);
  };

  public query ({ caller }) func getAllTailorProfiles() : async [TailorProfile] {
    tailorProfiles.values().toArray();
  };

  // User Role Management
  public shared ({ caller }) func updateUserRole(role : Text) : async () {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };

    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("User profile not found. Please create a profile first.");
      };
      case (?profile) {
        let updatedProfile = {
          profile with
          role = role;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  // Helper Functions for Default Configurations
  func getDefaultColorScheme() : ColorScheme {
    {
      primary = "#003366";
      secondary = "#FFD700";
      accent = "#FF5733";
      background = "#FFFFFF";
      text = "#000000";
    };
  };

  func getDefaultFontStyles() : {
    heading : TextStyle;
    body : TextStyle;
  } {
    {
      heading = {
        font = "Montserrat";
        size = 28;
        weight = #bold;
        color = "#000000";
      };
      body = {
        font = "Roboto";
        size = 16;
        weight = #normal;
        color = "#333333";
      };
    };
  };

  func getDefaultButtonStyles() : {
    primary : ButtonStyle;
    secondary : ButtonStyle;
  } {
    {
      primary = {
        background = "#003366";
        borderRadius = 8;
        padding = "12px 32px";
        text = {
          font = "Roboto";
          size = 18;
          weight = #bold;
          color = "#FFFFFF";
        };
      };
      secondary = {
        background = "#FFD700";
        borderRadius = 8;
        padding = "12px 32px";
        text = {
          font = "Roboto";
          size = 18;
          weight = #bold;
          color = "#003366";
        };
      };
    };
  };

  public query func getDefaultAppStyle() : async AppStyle {
    {
      colors = getDefaultColorScheme();
      fonts = getDefaultFontStyles();
      buttons = getDefaultButtonStyles();
      backgroundImage = null;
    };
  };
};
