export function errors(errorCode) {
  switch (errorCode) {
    case 401:
      return ("Invalid user name or password");
    case 402:
      return ("AUTHENTICATION FAILED");
    case 500:
      return ("NETWORK ERROR");
    case 501:
      return ("Unable to Create");
    case 502:
      return ("Unable to get list");
    case 503:
      return ("Unable to get");
    case 504:
      return ("Unable to edit");
    case 505:
      return ("Unable to delete");
    case 506:
      return ("Recipe not found for this customer");
    case 510:
      return ("Email does not exist.");
    case 520:
      return ("Please check your raw material available quantity");

      // ERRORCODE FOR DISPATCH
    case 801:
      return ("BOM is not created for this customer.");
    case 802:
      return ("Store material is not available for this product.");
    case 803:
      return ("BOM not found for this respective product.");
    case 804:
      return ("Please check your stock and update your stock quantity");

    case "NETWORK ERROR":
      return ("NETWORK ERROR");
    default:
      return ("NETWORK ERROR");
      // break;
  }
}