"use client";

const BRAND_LOGO = "data:image/webp;base64,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";


import { useEffect, useMemo, useState } from "react";
import { createClient, type User } from "@supabase/supabase-js";

const SUPABASE_URL = "https://iyfyghzqlcwzyjuqxjlu.supabase.co";
const SUPABASE_KEY = "sb_publishable_1JP2P6NgeRAf5ADPjJH78g_KkVa5MzE";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

type Product = any;
type CartLine = { product: Product; size: string; quantity: number };
type Address = any;
type Order = any;

const money = (n: number | string) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(Number(n));

const productImage = (product: Product) =>
  product?.images?.find((image: any) => image.is_primary)?.url ??
  product?.images?.[0]?.url ??
  "";

export default function Home() {
  const [tab, setTab] = useState("shop");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [banner, setBanner] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState("customer");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authOpen, setAuthOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [addressForm, setAddressForm] = useState({
    full_name: "",
    phone: "",
    address_text: "",
    area: "",
    city: "Pokhara",
    delivery_instructions: "",
  });
  const [zoneId, setZoneId] = useState("");
  const [payment, setPayment] = useState("cod");
  const [busy, setBusy] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    slug: "",
    sku: "",
    description: "",
    category_id: "",
    price: "",
    original_price: "",
    image_url: "",
    team: "NEPKITS",
    season: "2026",
  });
  const [review, setReview] = useState({ rating: 5, review: "" });
  const [supportText, setSupportText] = useState("");
  const [supportOpen, setSupportOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("nk-cart");
    if (savedCart) setCart(JSON.parse(savedCart));
    loadPublic();
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session?.user) loadUser(data.session.user);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadUser(session.user);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("nk-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(""), 3200);
    return () => window.clearTimeout(timeout);
  }, [message]);

  async function loadPublic() {
    const [p, c, z, b, s] = await Promise.all([
      supabase
        .from("products")
        .select(
          "*,category:categories(name,slug),images:product_images(url,is_primary,sort_order),sizes:product_sizes(id,size,stock_qty,sort_order)",
        )
        .eq("published", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase
        .from("categories")
        .select("id,name,slug,description,sort_order")
        .eq("is_active", true)
        .order("sort_order"),
      supabase.from("delivery_zones").select("*").eq("active", true).order("name"),
      supabase
        .from("homepage_banners")
        .select("*")
        .eq("active", true)
        .order("sort_order")
        .limit(1)
        .maybeSingle(),
      supabase.from("store_settings").select("*").limit(1).maybeSingle(),
    ]);

    setProducts(p.data ?? []);
    setCategories(c.data ?? []);
    setZones(z.data ?? []);
    setBanner(b.data ?? null);
    setSettings(s.data ?? null);
    if (z.data?.[0]) setZoneId(z.data[0].id);
  }

  async function loadUser(u: User) {
    const [p, a, o, w] = await Promise.all([
      supabase.from("profiles").select("full_name,role").eq("id", u.id).maybeSingle(),
      supabase.from("addresses").select("*").eq("user_id", u.id).order("created_at", { ascending: false }),
      supabase.from("orders").select("*,order_items(*)").eq("user_id", u.id).order("created_at", { ascending: false }),
      supabase.from("wishlists").select("product_id").eq("user_id", u.id),
    ]);

    const r = p.data?.role ?? "customer";
    setRole(r);
    setAddresses(a.data ?? []);
    setOrders(o.data ?? []);
    setWishlist((w.data ?? []).map((x: any) => x.product_id));

    if (a.data?.[0]) {
      setAddressForm({
        full_name: a.data[0].full_name,
        phone: a.data[0].phone,
        address_text: a.data[0].address_text,
        area: a.data[0].area,
        city: a.data[0].city,
        delivery_instructions: a.data[0].delivery_instructions ?? "",
      });
    }
    if (r === "admin") loadAdmin();
  }

  async function loadAdmin() {
    const [, o] = await Promise.all([
      supabase.from("products").select("*,category:categories(name)").order("created_at", { ascending: false }),
      supabase.from("orders").select("*,order_items(*)").order("created_at", { ascending: false }).limit(100),
    ]);
    setAdminOrders(o.data ?? []);
  }

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (!q ||
            [p.name, p.team, p.player, p.season, p.league, p.category?.name]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(q.toLowerCase())) &&
          (!cat || p.category_id === cat),
      ),
    [products, q, cat],
  );

  const latest = products.filter((p) => p.new_arrival);
  const featured = products.filter((p) => p.featured);
  const best = [...products]
    .sort((a, b) => Number(b.sold_count || 0) - Number(a.sold_count || 0))
    .slice(0, 6);
  const sale = products.filter((p) => Number(p.discount_percent || 0) > 0);
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0),
    [cart],
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function add(product: Product, size?: string, qty = 1) {
    const chosenSize =
      size ??
      product.sizes?.find((item: any) => Number(item.stock_qty) > 0)?.size ??
      "M";
    setCart((current) => {
      const index = current.findIndex(
        (item) => item.product.id === product.id && item.size === chosenSize,
      );
      if (index >= 0) {
        const next = [...current];
        next[index] = { ...next[index], quantity: next[index].quantity + qty };
        return next;
      }
      return [...current, { product, size: chosenSize, quantity: qty }];
    });
    setMessage("Added to bag.");
  }

  function remove(id: string, size: string) {
    setCart((current) => current.filter((item) => !(item.product.id === id && item.size === size)));
  }

  async function auth() {
    setBusy(true);
    setMessage("");
    const result =
      authMode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
          });

    setBusy(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }
    setAuthOpen(false);
    setMessage(authMode === "signup" ? "Account created. Check your email if confirmation is enabled." : "Signed in.");
  }

  async function signOut() {
    await supabase.auth.signOut();
    setRole("customer");
    setOrders([]);
    setAddresses([]);
    setWishlist([]);
    setTab("shop");
  }

  async function saveAddress(event: any) {
    event.preventDefault();
    if (!user) {
      setAuthOpen(true);
      return;
    }
    const { data, error } = await supabase
      .from("addresses")
      .insert({ ...addressForm, user_id: user.id, is_default: addresses.length === 0 })
      .select()
      .single();
    if (error) {
      setMessage(error.message);
      return;
    }
    setAddresses((current) => [data, ...current]);
    setMessage("Address saved.");
  }

  async function checkout() {
    if (!user) {
      setMessage("Please sign in before checkout.");
      setAuthOpen(true);
      return;
    }
    if (!addresses[0]) {
      setTab("account");
      setMessage("Save a delivery address first.");
      return;
    }
    if (!zoneId) {
      setMessage("Select an active delivery zone.");
      return;
    }

    setBusy(true);
    const { data, error } = await supabase.rpc("place_order", {
      p_user_id: user.id,
      p_items: cart.map((item) => ({
        product_id: item.product.id,
        size: item.size,
        quantity: item.quantity,
      })),
      p_address_id: addresses[0].id,
      p_delivery_zone_id: zoneId,
      p_payment_method: payment,
      p_coupon_code: null,
    });
    setBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }
    setCart([]);
    await loadUser(user);
    setTab("orders");
    setMessage("Order " + data.order_number + " created.");
  }

  async function toggleWish(product: Product) {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    if (wishlist.includes(product.id)) {
      await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_id", product.id);
      setWishlist((current) => current.filter((id) => id !== product.id));
    } else {
      await supabase.from("wishlists").insert({ user_id: user.id, product_id: product.id });
      setWishlist((current) => [...current, product.id]);
    }
  }

  async function addReview() {
    if (!user || !selected) {
      setAuthOpen(true);
      return;
    }
    const { error } = await supabase.from("reviews").insert({
      product_id: selected.id,
      user_id: user.id,
      rating: review.rating,
      review: review.review,
      reviewer_name: fullName || user.email?.split("@")[0] || "Customer",
    });
    if (error) {
      setMessage(error.message);
      return;
    }
    setReview({ rating: 5, review: "" });
    setMessage("Review submitted for moderation.");
  }

  async function sendSupport() {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .insert({ user_id: user.id, subject: "Customer support" })
      .select()
      .single();
    if (conversationError) {
      setMessage(conversationError.message);
      return;
    }
    const { error } = await supabase
      .from("messages")
      .insert({ conversation_id: conversation.id, sender_id: user.id, body: supportText });
    if (error) {
      setMessage(error.message);
      return;
    }
    setSupportText("");
    setSupportOpen(false);
    setMessage("Support message sent.");
  }

  async function createAdminProduct(event: any) {
    event.preventDefault();
    const { data: product, error } = await supabase
      .from("products")
      .insert({
        name: newProduct.name,
        slug: newProduct.slug,
        sku: newProduct.sku,
        description: newProduct.description,
        category_id: newProduct.category_id,
        team: newProduct.team,
        season: newProduct.season,
        price: Number(newProduct.price),
        original_price: newProduct.original_price ? Number(newProduct.original_price) : null,
        published: true,
        featured: true,
        new_arrival: true,
        total_stock: 40,
      })
      .select()
      .single();

    if (error) {
      setMessage(error.message);
      return;
    }

    await supabase.from("product_images").insert({
      product_id: product.id,
      url: newProduct.image_url,
      alt_text: product.name,
      is_primary: true,
      sort_order: 0,
    });

    await supabase.from("product_sizes").insert(
      ["S", "M", "L", "XL"].map((size, index) => ({
        product_id: product.id,
        size,
        stock_qty: 10,
        sort_order: index + 1,
      })),
    );

    setMessage("Product published.");
    setNewProduct({
      name: "",
      slug: "",
      sku: "",
      description: "",
      category_id: "",
      price: "",
      original_price: "",
      image_url: "",
      team: "NEPKITS",
      season: "2026",
    });
    await loadPublic();
    await loadAdmin();
  }

  async function updateOrder(id: string, status: string) {
    const { error } = await supabase.from("orders").update({ order_status: status }).eq("id", id);
    if (error) {
      setMessage(error.message);
      return;
    }
    await loadAdmin();
    setMessage("Order updated.");
  }

  function go(nextTab: string) {
    setTab(nextTab);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const heroImage = banner?.image_url || productImage(featured[0] || products[0]) || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1800&q=90";
  const heroSubtitle =
    banner?.subtitle ||
    settings?.tagline ||
    "Football culture. Premium jerseys. Built for fans.";

  return (
    <>
      <div className="announcement">
        <div className="site-shell announcement-inner">
          <span>{settings?.announcement || "Premium football culture, delivered."}</span>
          <span className="announcement-right">Free delivery promos update from store settings</span>
        </div>
      </div>

      <header className="site-header">
        <div className="site-shell header-inner">
          <button className="mobile-menu-btn" onClick={() => setMenuOpen((current) => !current)} aria-label="Menu">
            ☰
          </button>
          <button className="brand-mark logo-brand" onClick={() => go("shop")} aria-label="NEPKITS HUB home"><img src={BRAND_LOGO} alt="NEPKITS HUB" /></button>

          <nav className={"main-nav " + (menuOpen ? "open" : "")}>
            <button className="nav-link" onClick={() => go("shop")}>New Arrivals</button>
            <button className="nav-link" onClick={() => { setTab("shop"); setCat(categories.find((item) => /jersey/i.test(item.name))?.id || ""); setMenuOpen(false); }}>Jerseys</button>
            <button className="nav-link" onClick={() => { setTab("shop"); setCat(categories.find((item) => /kit/i.test(item.name))?.id || ""); setMenuOpen(false); }}>Kits</button>
            <button className="nav-link" onClick={() => go("shop")}>Collections</button>
            <button className="nav-link" onClick={() => { setTab("shop"); setCat(""); setMenuOpen(false); }}>Best Sellers</button>
            <button className="nav-link sale-link" onClick={() => { setTab("shop"); setCat(""); setQ(""); setMenuOpen(false); }}>Sale</button>{role === "admin" && <button className="nav-link admin-nav-link" onClick={() => { window.location.href = "/admin"; }}>Admin</button>}
          </nav>

          <div className="header-actions">
            <button className="icon-action search-toggle" onClick={() => go("shop")} aria-label="Search">⌕</button>
            <button className="icon-action hide-mobile" onClick={() => user ? go("account") : setAuthOpen(true)} aria-label="Account">◌</button>
            <button className="icon-action hide-mobile" onClick={() => user ? setMessage("Wishlist ready in your account.") : setAuthOpen(true)} aria-label="Wishlist">♡<span className="icon-count">{wishlist.length}</span></button>
            <button className="bag-action" onClick={() => go("cart")}>Bag <span>{cartCount}</span></button>
          </div>
        </div>
      </header>

      <main>
        {tab === "shop" && (
          <>
            <section className="hero-editorial">
              <div className="hero-media">
                <img src={heroImage} alt="NEPKITS HUB football fashion" />
                <div className="hero-vignette" />
              </div>
              <div className="site-shell hero-content">
                <div className="hero-copy">
                  <div className="eyebrow-light">NEPKITS HUB · 2026</div>
                  <h1>WEAR<br />THE GAME</h1>
                  <p>{heroSubtitle}</p>
                  <div className="hero-actions">
                    <button className="fashion-btn fashion-btn-light" onClick={() => document.getElementById("latest-drop")?.scrollIntoView({ behavior: "smooth" })}>Shop Collection</button>
                    <button className="fashion-btn fashion-btn-ghost-light" onClick={() => document.getElementById("latest-drop")?.scrollIntoView({ behavior: "smooth" })}>Explore New Arrivals</button>
                  </div>
                </div>
                <div className="hero-caption">
                  <span>{banner?.button_text || "The latest drop"}</span>
                  <span>{banner?.button_url || "/shop"}</span>
                </div>
              </div>
            </section>

            <section className="collection-strip">
              <div className="site-shell">
                <div className="section-intro compact">
                  <div>
                    <div className="eyebrow">Shop the edit</div>
                    <h2>Collections</h2>
                  </div>
                  <button className="text-link" onClick={() => go("shop")}>View all ↗</button>
                </div>
                <div className="collection-grid">
                  {categories.slice(0, 5).map((category) => {
                    const collectionProduct = products.find((product) => product.category_id === category.id);
                    return (
                      <button
                        className="collection-card"
                        key={category.id}
                        onClick={() => { setTab("shop"); setCat(category.id); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      >
                        <img src={productImage(collectionProduct)} alt={category.name} />
                        <span className="collection-overlay" />
                        <div className="collection-copy">
                          <span>{category.description || "Football culture"}</span>
                          <strong>{category.name}</strong>
                          <small>Explore ↗</small>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section id="latest-drop" className="product-section">
              <div className="site-shell">
                <div className="section-intro">
                  <div>
                    <div className="eyebrow">Latest drop</div>
                    <h2>THE LATEST DROP</h2>
                  </div>
                  <p>New season silhouettes, matchday staples and premium fanwear—curated from the live catalog.</p>
                </div>

                <div className="editorial-grid">
                  {(latest.length ? latest : featured).slice(0, 4).map((product, index) => (
                    <article className={"product-card editorial-product " + (index === 0 ? "feature-card" : "")} key={product.id}>
                      <div className="product-visual">
                        <img src={productImage(product)} alt={product.name} loading="lazy" />
                        <div className="product-badges">
                          {product.new_arrival && <span>NEW</span>}
                          {Number(product.discount_percent) > 0 && <span>SALE</span>}
                        </div>
                        <button className={"wishlist-btn " + (wishlist.includes(product.id) ? "saved" : "")} onClick={() => toggleWish(product)} aria-label="Wishlist">{wishlist.includes(product.id) ? "♥" : "♡"}</button>
                        <div className="hover-actions">
                          <button className="quick-btn" onClick={() => add(product)}>Quick Add</button>
                          <button className="quick-btn dark" onClick={() => setSelected(product)}>Quick View</button>
                        </div>
                      </div>
                      <div className="product-meta">
                        <div className="product-kicker">{product.team || "NEPKITS"} · {product.season || "2026"}</div>
                        <h3>{product.name}</h3>
                        <div className="product-price-row">
                          <strong>{money(product.price)}</strong>
                          {product.original_price && <del>{money(product.original_price)}</del>}
                          {Number(product.discount_percent) > 0 && <span>{Math.round(Number(product.discount_percent))}% OFF</span>}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="feature-band">
              <div className="site-shell feature-band-grid">
                <div>
                  <div className="eyebrow">NEPKITS HUB</div>
                  <h2>Football culture,<br /><i>refined.</i></h2>
                  <p>Minimal silhouettes. Matchday energy. A tighter edit of the shirts and sportswear you actually want to wear beyond the stadium.</p>
                  <button className="fashion-btn dark-fill" onClick={() => go("shop")}>Explore the collection</button>
                </div>
                <div className="feature-photo">
                  <img src={productImage(products.find((product) => product.bestseller) || products[1]) || "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=1400&q=88"} alt="NEPKITS HUB supporter style" loading="lazy" />
                </div>
              </div>
            </section>

            <section className="product-section soft">
              <div className="site-shell">
                <div className="section-intro">
                  <div>
                    <div className="eyebrow">Fan favorites</div>
                    <h2>FAN FAVORITES</h2>
                  </div>
                  <button className="text-link" onClick={() => go("shop")}>Shop best sellers ↗</button>
                </div>
                <div className="horizontal-products">
                  {best.map((product) => (
                    <article className="mini-product-card" key={product.id}>
                      <div className="mini-visual">
                        <img src={productImage(product)} alt={product.name} loading="lazy" />
                        <button className="wishlist-btn" onClick={() => toggleWish(product)} aria-label="Wishlist">{wishlist.includes(product.id) ? "♥" : "♡"}</button>
                      </div>
                      <div className="mini-meta">
                        <div className="product-kicker">{product.team || "NEPKITS"}</div>
                        <h3>{product.name}</h3>
                        <div className="product-price-row"><strong>{money(product.price)}</strong><span>★ {Number(product.rating || 0).toFixed(1)}</span></div>
                        <button className="under-btn" onClick={() => add(product)}>Quick Add</button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {sale.length > 0 && (
              <section className="sale-banner">
                <div className="site-shell sale-inner">
                  <div>
                    <div className="eyebrow">Limited edit</div>
                    <h2>SALE · {Math.max(...sale.map((product) => Math.round(Number(product.discount_percent || 0))))}% OFF</h2>
                    <p>Selected styles, limited sizes, same NEPKITS quality.</p>
                  </div>
                  <button className="fashion-btn fashion-btn-dark" onClick={() => go("cart")}>View sale styles</button>
                </div>
              </section>
            )}
          </>
        )}

        {tab === "cart" && (
          <section className="shop-shell">
            <div className="site-shell">
              <div className="page-heading"><div className="eyebrow">The bag</div><h1>YOUR BAG</h1><p>{cartCount} items</p></div>
              {cart.length ? (
                <div className="bag-grid">
                  <div className="bag-list">
                    {cart.map((item) => (
                      <div className="bag-line" key={item.product.id + item.size}>
                        <img src={productImage(item.product)} alt={item.product.name} />
                        <div className="bag-info">
                          <div className="product-kicker">{item.product.team || "NEPKITS"} · {item.product.season || "2026"}</div>
                          <h3>{item.product.name}</h3>
                          <div className="muted-line">Size {item.size}</div>
                          <div className="bag-controls">
                            <div className="qty-stepper">
                              <button onClick={() => setCart((current) => current.map((line) => line === item ? { ...line, quantity: Math.max(1, line.quantity - 1) } : line))}>−</button>
                              <span>{item.quantity}</span>
                              <button onClick={() => setCart((current) => current.map((line) => line === item ? { ...line, quantity: line.quantity + 1 } : line))}>+</button>
                            </div>
                            <button className="line-link" onClick={() => remove(item.product.id, item.size)}>Remove</button>
                          </div>
                        </div>
                        <strong className="bag-price">{money(Number(item.product.price) * item.quantity)}</strong>
                      </div>
                    ))}
                  </div>
                  <aside className="summary-card">
                    <div className="eyebrow">Order summary</div>
                    <div className="summary-row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
                    <div className="summary-row muted-line"><span>Delivery</span><span>Calculated at checkout</span></div>
                    <div className="summary-divider" />
                    <div className="summary-row total"><span>Total</span><strong>{money(subtotal)}</strong></div>
                    <select className="fashion-select" value={zoneId} onChange={(e) => setZoneId(e.target.value)}>{zones.map((zone) => <option key={zone.id} value={zone.id}>{zone.name} — {money(zone.delivery_fee)}</option>)}</select>
                    <div className="payment-row">
                      <button className={payment === "cod" ? "pay active" : "pay"} onClick={() => setPayment("cod")}>Cash on delivery</button>
                      <button className={payment === "esewa" ? "pay active" : "pay"} onClick={() => setPayment("esewa")}>eSewa</button>
                    </div>
                    <button className="checkout-btn" onClick={checkout} disabled={busy}>{busy ? "Creating order…" : "CHECKOUT"}</button>
                  </aside>
                </div>
              ) : (
                <div className="empty-state"><div className="eyebrow">Nothing here yet</div><h2>YOUR BAG IS EMPTY</h2><p>Start with the latest football edit.</p><button className="checkout-btn small-cta" onClick={() => go("shop")}>SHOP NOW</button></div>
              )}
            </div>
          </section>
        )}

        {tab === "account" && (
          <section className="shop-shell">
            <div className="site-shell">
              <div className="page-heading"><div className="eyebrow">Account</div><h1>YOUR PROFILE</h1><p>{user?.email || "Sign in to manage your account."}</p></div>
              {user ? (
                <div className="account-grid">
                  <aside className="account-sidebar">
                    <div className="member-card">
                      <div className="avatar">{(fullName || user.email || "N").slice(0, 1).toUpperCase()}</div>
                      <strong>{fullName || "NEPKITS member"}</strong>
                      <span>Member since {new Date(user.created_at).getFullYear()}</span>
                    </div>
                    {["account", "orders", "cart"].map((item) => <button key={item} className={tab === item ? "account-link active" : "account-link"} onClick={() => go(item)}>{item === "account" ? "Overview" : item[0].toUpperCase() + item.slice(1)}</button>)}
                    <button className="account-link" onClick={() => setSupportOpen(true)}>Support</button>
                    <button className="account-link" onClick={signOut}>Logout</button>
                  </aside>
                  <div className="account-main">
                    <div className="account-stats">
                      <div><span>Orders</span><strong>{orders.length}</strong></div>
                      <div><span>Wishlist</span><strong>{wishlist.length}</strong></div>
                      <div><span>Saved addresses</span><strong>{addresses.length}</strong></div>
                    </div>
                    <div className="account-panel">
                      <div className="panel-heading"><div><div className="eyebrow">Shipping</div><h2>Saved address</h2></div></div>
                      <form className="account-form" onSubmit={saveAddress}>
                        <input className="fashion-input" value={addressForm.full_name} onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })} placeholder="Full name" required />
                        <input className="fashion-input" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} placeholder="Phone" required />
                        <input className="fashion-input wide" value={addressForm.address_text} onChange={(e) => setAddressForm({ ...addressForm, address_text: e.target.value })} placeholder="Address" required />
                        <input className="fashion-input" value={addressForm.area} onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })} placeholder="Area" required />
                        <input className="fashion-input" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} placeholder="City" required />
                        <textarea className="fashion-input wide textarea" value={addressForm.delivery_instructions} onChange={(e) => setAddressForm({ ...addressForm, delivery_instructions: e.target.value })} placeholder="Delivery instructions" />
                        <button className="checkout-btn small-cta">SAVE ADDRESS</button>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-state"><div className="eyebrow">Member access</div><h2>SIGN IN TO YOUR ACCOUNT</h2><p>Orders, wishlist, saved addresses and support live here.</p><button className="checkout-btn small-cta" onClick={() => setAuthOpen(true)}>SIGN IN</button></div>
              )}
            </div>
          </section>
        )}

        {tab === "orders" && (
          <section className="shop-shell">
            <div className="site-shell">
              <div className="page-heading"><div className="eyebrow">Orders</div><h1>ORDER HISTORY</h1><p>Track every drop from confirmed to delivered.</p></div>
              {user && orders.length ? (
                <div className="orders-stack">
                  {orders.map((order) => (
                    <article className="order-card" key={order.id}>
                      <div className="order-head"><div><div className="eyebrow">Order</div><strong>{order.order_number}</strong></div><div className="order-status">{order.order_status.replaceAll("_", " ")}</div></div>
                      <div className="order-timeline">{["confirmed", "packed", "shipped", "out_for_delivery", "delivered"].map((status, index) => <div className={["confirmed", "packed", "shipped", "out_for_delivery", "delivered"].indexOf(order.order_status) >= index ? "timeline-step active" : "timeline-step"} key={status}><span>{index + 1}</span><small>{status.replaceAll("_", " ")}</small></div>)}</div>
                      <div className="order-body">
                        <div>{(order.order_items ?? []).map((item: any) => <div className="order-item" key={item.id}><img src={item.product_image_url || ""} alt={item.product_name} /><div><strong>{item.product_name}</strong><div className="muted-line">Size {item.size} · Qty {item.quantity}</div></div><strong>{money(item.subtotal)}</strong></div>)}</div>
                        <div className="order-total"><span>Total</span><strong>{money(order.total)}</strong><span className="muted-line">{order.payment_method} · {order.payment_status}</span></div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : <div className="empty-state"><div className="eyebrow">Your archive</div><h2>NO ORDERS YET</h2><p>Your purchases will appear here.</p><button className="checkout-btn small-cta" onClick={() => go("shop")}>START SHOPPING</button></div>}
            </div>
          </section>
        )}

        {tab === "admin" && role === "admin" && (
          <section className="shop-shell">
            <div className="site-shell">
              <div className="page-heading"><div className="eyebrow">Store control</div><h1>ADMIN PORTAL</h1><p>Live catalog, inventory and order operations.</p></div>
              <div className="admin-grid">
                <div className="account-panel">
                  <div className="panel-heading"><div><div className="eyebrow">Catalog</div><h2>Publish product</h2></div></div>
                  <form className="account-form" onSubmit={createAdminProduct}>
                    <input className="fashion-input" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Product name" required />
                    <input className="fashion-input" value={newProduct.slug} onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })} placeholder="Slug" required />
                    <input className="fashion-input" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} placeholder="SKU" required />
                    <select className="fashion-select wide" value={newProduct.category_id} onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })} required><option value="">Category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
                    <input className="fashion-input" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="Price" required />
                    <input className="fashion-input" value={newProduct.original_price} onChange={(e) => setNewProduct({ ...newProduct, original_price: e.target.value })} placeholder="Original price" />
                    <input className="fashion-input wide" value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} placeholder="Product image URL" required />
                    <textarea className="fashion-input wide textarea" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Description" />
                    <button className="checkout-btn small-cta">PUBLISH PRODUCT</button>
                  </form>
                </div>
                <div className="account-panel">
                  <div className="panel-heading"><div><div className="eyebrow">Orders</div><h2>Live order queue</h2></div></div>
                  <div className="admin-order-list">{adminOrders.map((order) => <div className="admin-order" key={order.id}><div><strong>{order.order_number}</strong><span className="muted-line">{money(order.total)} · {order.payment_method}</span></div><select className="fashion-select compact" value={order.order_status} onChange={(e) => updateOrder(order.id, e.target.value)}>{["placed","confirmed","processing","packed","shipped","out_for_delivery","delivered","cancelled"].map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}</select></div>)}</div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="site-shell footer-grid">
          <div>
            <button className="brand-mark logo-brand footer-brand" onClick={() => go("shop")}><img src={BRAND_LOGO} alt="NEPKITS HUB" /></button>
            <p>Football culture. Premium jerseys. Built for fans.</p>
          </div>
          <div><div className="footer-label">Shop</div><button onClick={() => go("shop")}>New arrivals</button><button onClick={() => go("shop")}>Best sellers</button><button onClick={() => go("shop")}>Sale</button></div>
          <div><div className="footer-label">Help</div><button onClick={() => setSupportOpen(true)}>Support</button><button onClick={() => go("orders")}>Track order</button><button onClick={() => go("account")}>Account</button></div>
          <div><div className="footer-label">Store</div><span>{settings?.tagline || "Premium football jerseys, kits and sportswear."}</span><span>{settings?.delivery_notes || "Delivery is configured by the store."}</span></div>
        </div>
      </footer>

      <div className="mobile-bottom-nav">
        <button onClick={() => go("shop")} className={tab === "shop" ? "active" : ""}><span>⌂</span>Home</button>
        <button onClick={() => go("shop")}><span>⌕</span>Shop</button>
        <button onClick={() => user ? setMessage("Wishlist is available from your account.") : setAuthOpen(true)}><span>♡</span>Wishlist</button>
        <button onClick={() => go("cart")} className={tab === "cart" ? "active" : ""}><span>Bag</span>{cartCount}</button>
        <button onClick={() => user ? go("account") : setAuthOpen(true)} className={tab === "account" ? "active" : ""}><span>◌</span>Profile</button>
      </div>

      {message && <div className="toast">{message}</div>}

      {selected && (
        <div className="overlay" onMouseDown={(event) => { if (event.currentTarget === event.target) setSelected(null); }}>
          <div className="drawer">
            <div className="drawer-head"><div><div className="eyebrow">Quick view</div><h2>{selected.name}</h2></div><button className="close-btn" onClick={() => setSelected(null)}>×</button></div>
            <div className="drawer-grid">
              <div className="drawer-image"><img src={productImage(selected)} alt={selected.name} /></div>
              <div className="drawer-copy">
                <div className="product-kicker">{selected.team || "NEPKITS"} · {selected.season || "2026"}</div>
                <div className="drawer-price">{money(selected.price)} {selected.original_price && <del>{money(selected.original_price)}</del>}</div>
                <p>{selected.description}</p>
                <div className="eyebrow">Size</div>
                <div className="size-row">{(selected.sizes ?? []).map((size: any) => <button className="size-chip" disabled={Number(size.stock_qty) < 1} key={size.id} onClick={() => add(selected, size.size)}>{size.size}</button>)}</div>
                <button className="checkout-btn" onClick={() => { add(selected); setSelected(null); }}>ADD TO BAG</button>
                <button className="drawer-wish" onClick={() => toggleWish(selected)}>{wishlist.includes(selected.id) ? "♥ Saved to wishlist" : "♡ Save to wishlist"}</button>
                <div className="drawer-detail-list">
                  <div><span>Material</span><strong>{selected.material || "Premium polyester"}</strong></div>
                  <div><span>Fit</span><strong>{selected.fit || "Regular"}</strong></div>
                  <div><span>Availability</span><strong>{Number(selected.total_stock) > 0 ? "In stock" : "Sold out"}</strong></div>
                </div>
                <div className="review-box"><div className="eyebrow">Reviews</div><div className="review-stars">★ {Number(selected.rating || 0).toFixed(1)}</div><textarea className="fashion-input textarea" value={review.review} onChange={(e) => setReview({ ...review, review: e.target.value })} placeholder="Share your experience" /><button className="under-btn" onClick={addReview}>Submit review</button></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {supportOpen && (
        <div className="overlay">
          <div className="auth-card">
            <div className="drawer-head"><div><div className="eyebrow">Support</div><h2>HOW CAN WE HELP?</h2></div><button className="close-btn" onClick={() => setSupportOpen(false)}>×</button></div>
            <textarea className="fashion-input textarea wide" value={supportText} onChange={(e) => setSupportText(e.target.value)} placeholder="Tell us what you need." />
            <button className="checkout-btn" onClick={sendSupport}>SEND MESSAGE</button>
          </div>
        </div>
      )}

      {authOpen && (
        <div className="overlay">
          <div className="auth-card">
            <div className="drawer-head"><div><div className="eyebrow">Member access</div><h2>{authMode === "login" ? "WELCOME BACK" : "JOIN NEPKITS HUB"}</h2></div><button className="close-btn" onClick={() => setAuthOpen(false)}>×</button></div>
            {authMode === "signup" && <input className="fashion-input wide" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" />}
            <input className="fashion-input wide" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input className="fashion-input wide" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button className="checkout-btn" disabled={busy} onClick={auth}>{busy ? "PLEASE WAIT…" : authMode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}</button>
            <button className="text-link auth-switch" onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}>{authMode === "login" ? "Need an account? Create one" : "Already a member? Sign in"}</button>
          </div>
        </div>
      )}
    </>
  );
}