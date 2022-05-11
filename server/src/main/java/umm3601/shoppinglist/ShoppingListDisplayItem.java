package umm3601.shoppinglist;
import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({ "VisibilityModifier", "MemberName" })
public class ShoppingListDisplayItem {
  @ObjectId
  @Id
  // By default Java field names shouldn't start with underscores.
  // Here, though, we *have* to use the name `_id` to match the
  // name of the field as used by MongoDB.
  public String _id;
  public String product;
  public String productName;
  public String brand;
  public String location;
  public int count;
}
