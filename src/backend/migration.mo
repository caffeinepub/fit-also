import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Blob "blob-storage/Storage";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";

module {
  // Old types
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

  type UserProfile = {
    name : Text;
    phoneNumber : Text;
    city : Text;
    preferredLanguage : Text;
    measurements : [Measurement];
  };

  // New types
  type UserProfileV2 = {
    name : Text;
    phoneNumber : Text;
    city : Text;
    preferredLanguage : Text;
    measurements : [Measurement];
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

  type OldActor = {
    approvalState : UserApproval.UserApprovalState;
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal, UserProfile>;
    notifications : List.List<Notification>;
    platformConfig : ?PlatformConfig;
  };

  type NewActor = {
    approvalState : UserApproval.UserApprovalState;
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal, UserProfileV2>;
    notifications : List.List<Notification>;
    platformConfig : ?PlatformConfig;
    orders : Map.Map<Text, Order>;
    tailorProfiles : Map.Map<Text, TailorProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, UserProfile, UserProfileV2>(
      func(_p, oldProfile) {
        let emptyJson = "{ \"measurements\": [] }";
        let role = if (oldProfile.measurements.size() > 0) {
          "customer";
        } else { "customer" };
        {
          oldProfile with
          measurementsJson = emptyJson;
          role;
        };
      }
    );

    {
      old with
      userProfiles = newUserProfiles;
      orders = Map.empty<Text, Order>();
      tailorProfiles = Map.empty<Text, TailorProfile>();
    };
  };
};
