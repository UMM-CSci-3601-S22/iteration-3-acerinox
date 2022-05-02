package umm3601.shoppinglist;
import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({ "VisibilityModifier", "MemberName" })
public class ShoppingListItem {
  @ObjectId
  @Id
  // By default Java field names shouldn't start with underscores.
  // Here, though, we *have* to use the name `_id` to match the
  // name of the field as used by MongoDB.
  public String _id;

  @ObjectId
  public String product;
  public int count;
}
