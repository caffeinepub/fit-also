import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
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

  // State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let approvalState = UserApproval.initState(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfileV2>();
  let orders = Map.empty<Text, Order>();
  let tailorProfiles = Map.empty<Text, TailorProfile>();
  var platformConfig : ?PlatformConfig = null;
  let notifications = List.empty<Notification>();

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

  // Approval System
  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
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

  // Orders Management
  public shared ({ caller }) func placeOrder(order : Order) : async Text {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };

    orders.add(order.id, order);
    order.id;
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };

    let principalText = caller.toText();
    orders.filter(
      func(_k, o) { o.customerPrincipal == principalText }
    ).values().toArray();
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, newStatus : Text, adminNote : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (orders.get(orderId)) {
      case (null) {
        Runtime.trap("Order not found");
      };
      case (?order) {
        let updatedOrder = {
          order with
          status = newStatus;
          adminNotes = adminNote;
        };
        orders.add(orderId, updatedOrder);

        // Create notification for customer
        let notification : Notification = {
          id = orderId # "-status";
          title = "Order Status Updated";
          body = "Your order status was changed to: " # newStatus;
          targetAudience = #customers;
          timestamp = 0;
        };
        notifications.add(notification);
      };
    };
  };

  public shared ({ caller }) func setOrderDeliveryDate(orderId : Text, deliveryDate : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (orders.get(orderId)) {
      case (null) {
        Runtime.trap("Order not found");
      };
      case (?order) {
        let updatedOrder = {
          order with
          estimatedDeliveryDate = deliveryDate;
        };
        orders.add(orderId, updatedOrder);
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

  public query func getTailorProfile(tailorId : Text) : async ?TailorProfile {
    tailorProfiles.get(tailorId);
  };

  public query func getAllTailorProfiles() : async [TailorProfile] {
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
