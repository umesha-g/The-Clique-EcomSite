import axios from "axios";

export const fetchWishlist = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/wishlist");
    setWishlist(response.data.map((item: { id: number }) => item.id));
  } catch (error) {
    console.error("Error fetching wishlist:", error);
  }
};

export const toggleWishlist = async (productId: number) => {
  try {
    if (wishlist.includes(productId)) {
      await axios.delete(
        `http://localhost:8080/api/wishlist/item/${productId}`
      );
      setWishlist((prev) => prev.filter((id) => id !== productId));
    } else {
      await axios.post("http://localhost:8080/api/wishlist", { productId });
      setWishlist((prev) => [...prev, productId]);
    }
  } catch (error) {
    console.error("Error updating wishlist:", error);
  }
};
