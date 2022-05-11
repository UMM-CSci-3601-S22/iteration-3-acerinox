package umm3601.shoppinglist;
import java.util.ArrayList;

@SuppressWarnings({ "VisibilityModifier", "MemberName" })
public class ShoppingListStoreGroup {
  //@ObjectId
  //@Id
  // By default Java field names shouldn't start with underscores.
  // Here, though, we *have* to use the name `_id` to match the
  // name of the field as used by MongoDB.
  public ArrayList<ShoppingListDisplayItem> products;
  public String store;
}
