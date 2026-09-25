"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient, type User } from "@supabase/supabase-js";

const SUPABASE_URL = "https://iyfyghzqlcwzyjuqxjlu.supabase.co";
const SUPABASE_KEY = "sb_publishable_1JP2P6NgeRAf5ADPjJH78g_KkVa5MzE";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const money = (n: number | string) =>
  new Intl.NumberFormat("en-NP", { style: "currency", currency: "NPR", maximumFractionDigits: 0 }).format(Number(n));

const ORDER_STATUSES = ["placed","confirmed","processing","packed","shipped","out_for_delivery","delivered","cancelled"];

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState("overview");
  const [message, setMessage] = useState("");

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [banner, setBanner] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);

  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [reviewFilter, setReviewFilter] = useState("pending");
  const [editing, setEditing] = useState<any>(null);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [reply, setReply] = useState("");
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [settingsDraft, setSettingsDraft] = useState<any>(null);
  const [bannerDraft, setBannerDraft] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user ?? null);
      if (!data.user) {
        setLoading(false);
        return;
      }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
      setRole(profile?.role ?? "customer");
      if (profile?.role === "admin") await loadAll();
      setLoading(false);
    });
  }, []);

  useEffect(() => { if (settings) setSettingsDraft(settings); }, [settings]);
  useEffect(() => { if (banner) setBannerDraft(banner); }, [banner]);

  function notify(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3000);
  }

  async function loadAll() {
    const [p, o, r, c, conv, cat, z, b, s] = await Promise.all([
      supabase.from("products").select("*,category:categories(name,slug),images:product_images(id,url,is_primary,sort_order),sizes:product_sizes(id,size,stock_qty,sort_order)").order("created_at", { ascending: false }),
      supabase.from("orders").select("*,order_items(*)").order("created_at", { ascending: false }).limit(250),
      supabase.from("reviews").select("*,product:products(name)").order("created_at", { ascending: false }).limit(250),
      supabase.from("profiles").select("id,full_name,username,phone,role,created_at").order("created_at", { ascending: false }).limit(500),
      supabase.from("conversations").select("*").order("updated_at", { ascending: false }).limit(250),
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("delivery_zones").select("*").order("name"),
      supabase.from("homepage_banners").select("*").eq("active", true).order("sort_order").limit(1).maybeSingle(),
      supabase.from("store_settings").select("*").limit(1).maybeSingle()
    ]);
    setProducts(p.data ?? []);
    setOrders(o.data ?? []);
    setReviews(r.data ?? []);
    setCustomers(c.data ?? []);
    setConversations(conv.data ?? []);
    setCategories(cat.data ?? []);
    setZones(z.data ?? []);
    setBanner(b.data ?? null);
    setSettings(s.data ?? null);
  }

  const filteredProducts = useMemo(
    () => products.filter((p) => (p.name + " " + (p.sku || "") + " " + (p.team || "")).toLowerCase().includes(productSearch.toLowerCase())),
    [products, productSearch]
  );
  const filteredOrders = useMemo(
    () => orders.filter((o) => (o.order_number + " " + (o.full_name || "") + " " + (o.phone || "")).toLowerCase().includes(orderSearch.toLowerCase())),
    [orders, orderSearch]
  );
  const filteredReviews = useMemo(
    () => reviews.filter((r) => reviewFilter === "all" || r.status === reviewFilter),
    [reviews, reviewFilter]
  );

  const pendingReviews = reviews.filter((r) => r.status === "pending").length;
  const lowStock = products.filter((p) => Number(p.total_stock || 0) <= 8).length;
  const openSupport = conversations.filter((c) => c.status !== "closed").length;
  const gross = orders.filter((o) => o.payment_status === "paid" || o.payment_method === "cod")
    .reduce((s, o) => s + Number(o.total || 0), 0);

  async function saveProduct() {
    if (!editing) return;
    const payload = {
      name: editing.name,
      slug: editing.slug,
      sku: editing.sku,
      description: editing.description,
      category_id: editing.category_id || null,
      team: editing.team,
      player: editing.player,
      season: editing.season,
      league: editing.league,
      jersey_type: editing.jersey_type,
      material: editing.material,
      fit: editing.fit,
      price: Number(editing.price || 0),
      original_price: editing.original_price ? Number(editing.original_price) : null,
      discount_percent: Number(editing.discount_percent || 0),
      rating: Number(editing.rating || 0),
      review_count: Number(editing.review_count || 0),
      sold_count: Number(editing.sold_count || 0),
      total_stock: Number(editing.total_stock || 0),
      featured: !!editing.featured,
      bestseller: !!editing.bestseller,
      new_arrival: !!editing.new_arrival,
      published: !!editing.published
    };
    const result = editing.id
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (result.error) {
      notify(result.error.message);
      return;
    }
    setEditing(null);
    await loadAll();
    notify("Product saved.");
  }

  async function setOrderStatus(id: string, status: string) {
    const { error } = await supabase.from("orders").update({ order_status: status }).eq("id", id);
    if (error) notify(error.message);
    else { await loadAll(); notify("Order updated."); }
  }

  async function setReviewStatus(id: string, status: string) {
    const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
    if (error) notify(error.message);
    else { await loadAll(); notify("Review " + status + "."); }
  }

  async function updateStock(id: string, value: string) {
    const { error } = await supabase.from("product_sizes").update({ stock_qty: Math.max(0, Number(value)) }).eq("id", id);
    if (error) notify(error.message);
    else { await loadAll(); notify("Inventory updated."); }
  }

  async function addCategory(event: React.FormEvent) {
    event.preventDefault();
    const slug = newCategory.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { error } = await supabase.from("categories").insert({
      name: newCategory.name,
      slug,
      description: newCategory.description,
      sort_order: categories.length + 1,
      is_active: true
    });
    if (error) notify(error.message);
    else { setNewCategory({ name: "", description: "" }); await loadAll(); notify("Category created."); }
  }

  async function saveSettings(event: React.FormEvent) {
    event.preventDefault();
    if (!settingsDraft) return;
    const { error } = await supabase.from("store_settings").update({
      store_name: settingsDraft.store_name,
      tagline: settingsDraft.tagline,
      announcement: settingsDraft.announcement,
      logo_url: settingsDraft.logo_url,
      support_email: settingsDraft.support_email,
      support_phone: settingsDraft.support_phone,
      delivery_notes: settingsDraft.delivery_notes,
      currency: settingsDraft.currency
    }).eq("id", true);
    if (error) notify(error.message);
    else { await loadAll(); notify("Store settings saved."); }
  }

  async function saveBanner(event: React.FormEvent) {
    event.preventDefault();
    if (!bannerDraft) return;
    const { error } = await supabase.from("homepage_banners").update({
      title: bannerDraft.title,
      subtitle: bannerDraft.subtitle,
      button_text: bannerDraft.button_text,
      button_url: bannerDraft.button_url,
      image_url: bannerDraft.image_url,
      accent: bannerDraft.accent,
      active: !!bannerDraft.active
    }).eq("id", bannerDraft.id);
    if (error) notify(error.message);
    else { await loadAll(); notify("Homepage banner saved."); }
  }

  async function sendReply(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedConversation || !user || !reply.trim()) return;
    const { error } = await supabase.from("messages").insert({
      conversation_id: selectedConversation.id,
      sender_id: user.id,
      body: reply.trim()
    });
    if (error) notify(error.message);
    else { setReply(""); await loadAll(); notify("Support reply sent."); }
  }

  if (loading) return <div className="admin-loading"><div className="admin-spinner" />Loading admin workspace…</div>;

  if (!user || role !== "admin") {
    return (
      <div className="admin-gate">
        <div className="admin-gate-card">
          <div className="eyebrow">NEPKITS HUB</div>
          <h1>ADMIN ACCESS</h1>
          <p>{!user ? "Sign in to an administrator account to manage the store." : "This account is not assigned the admin role."}</p>
          <a className="checkout-btn admin-gate-btn" href="/">RETURN TO STORE</a>
        </div>
      </div>
    );
  }

  const nav = [
    ["overview", "Overview"],
    ["products", "Products"],
    ["orders", "Orders"],
    ["reviews", "Reviews"],
    ["customers", "Customers"],
    ["support", "Support"],
    ["homepage", "Homepage"],
    ["settings", "Settings"]
  ];

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-logo"><span>NEP</span>KITS <em>HUB</em></div>
          <span>Store operations</span>
        </div>
        <nav className="admin-nav">
          {nav.map(([key, label]) => (
            <button key={key} className={section === key ? "active" : ""} onClick={() => setSection(key)}>
              <span>{label}</span>
              {key === "reviews" && pendingReviews ? <b>{pendingReviews}</b> : null}
              {key === "support" && openSupport ? <b>{openSupport}</b> : null}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <a className="admin-store-link" href="/">← Back to store</a>
          <button className="admin-store-link" onClick={async () => { await supabase.auth.signOut(); window.location.href = "/"; }}>Sign out</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div><div className="eyebrow">NEPKITS HUB / Admin</div><h1>{section === "overview" ? "Store overview" : section.charAt(0).toUpperCase() + section.slice(1)}</h1></div>
          <div className="admin-user-chip"><span>{(user.email || "A").slice(0, 1).toUpperCase()}</span><div><strong>Administrator</strong><small>{user.email}</small></div></div>
        </header>

        {section === "overview" && (
          <div className="admin-content">
            <div className="admin-kpi-grid">
              <div className="admin-kpi"><span>Live products</span><strong>{products.filter((p) => p.published).length}</strong><small>{products.length} catalog records</small></div>
              <div className="admin-kpi"><span>Orders</span><strong>{orders.length}</strong><small>{orders.filter((o) => o.order_status !== "delivered" && o.order_status !== "cancelled").length} active</small></div>
              <div className="admin-kpi"><span>Gross order value</span><strong>{money(gross)}</strong><small>Current order records</small></div>
              <div className="admin-kpi"><span>Attention</span><strong>{lowStock + pendingReviews + openSupport}</strong><small>{lowStock} stock · {pendingReviews} reviews · {openSupport} support</small></div>
            </div>

            <div className="admin-dashboard-grid">
              <section className="admin-panel">
                <div className="admin-panel-head"><div><div className="eyebrow">Fulfillment</div><h2>Recent orders</h2></div><button onClick={() => setSection("orders")}>View all ↗</button></div>
                <div className="admin-table">
                  {orders.slice(0, 8).map((order) => (
                    <div className="admin-row" key={order.id}>
                      <div><strong>{order.order_number}</strong><small>{order.full_name} · {order.city}</small></div>
                      <strong>{money(order.total)}</strong>
                      <select value={order.order_status} onChange={(e) => setOrderStatus(order.id, e.target.value)}>{ORDER_STATUSES.map((s) => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}</select>
                    </div>
                  ))}
                  {!orders.length && <div className="admin-empty">No orders yet.</div>}
                </div>
              </section>

              <section className="admin-panel">
                <div className="admin-panel-head"><div><div className="eyebrow">Inventory</div><h2>Low stock</h2></div><button onClick={() => setSection("products")}>Manage ↗</button></div>
                <div className="admin-table">
                  {products.filter((p) => Number(p.total_stock || 0) <= 8).slice(0, 8).map((p) => (
                    <div className="admin-row" key={p.id}>
                      <div><strong>{p.name}</strong><small>{p.sku || "No SKU"}</small></div>
                      <strong>{p.total_stock || 0}</strong>
                      <span className="admin-pill warning">Low</span>
                    </div>
                  ))}
                  {!lowStock && <div className="admin-empty">No low-stock products.</div>}
                </div>
              </section>
            </div>

            <section className="admin-panel quick-actions">
              <div className="admin-panel-head"><div><div className="eyebrow">Operations</div><h2>Quick actions</h2></div></div>
              <div className="admin-quick-grid">
                <button onClick={() => setSection("products")}><strong>Manage products</strong><span>Pricing, images, variants and merchandising flags.</span></button>
                <button onClick={() => setSection("orders")}><strong>Process orders</strong><span>Update fulfillment status and review payment state.</span></button>
                <button onClick={() => setSection("reviews")}><strong>Moderate reviews</strong><span>Approve or reject customer reviews.</span></button>
                <button onClick={() => setSection("homepage")}><strong>Edit homepage</strong><span>Control hero messaging and campaign imagery.</span></button>
              </div>
            </section>
          </div>
        )}

        {section === "products" && (
          <div className="admin-content">
            <div className="admin-toolbar">
              <input className="fashion-input" placeholder="Search name, SKU or team…" value={productSearch} onChange={(e) => setProductSearch(e.target.value)} />
              <button className="admin-toolbar-btn" onClick={() => setEditing({ name: "", slug: "", sku: "", description: "", category_id: categories[0]?.id || "", team: "NEPKITS", season: "2026", price: 0, original_price: "", discount_percent: 0, rating: 0, review_count: 0, sold_count: 0, total_stock: 0, featured: false, bestseller: false, new_arrival: true, published: false })}>New product</button>
            </div>

            <section className="admin-panel">
              <div className="admin-panel-head"><div><div className="eyebrow">Catalog</div><h2>{filteredProducts.length} products</h2></div></div>
              <div className="admin-product-list">
                {filteredProducts.map((p) => (
                  <div className="admin-product-row" key={p.id}>
                    <div className="admin-product-image"><img src={p.images?.[0]?.url || ""} alt={p.name} /></div>
                    <div className="admin-product-main"><strong>{p.name}</strong><span>{p.sku || "No SKU"} · {p.team || "NEPKITS"} · {p.season || "—"}</span><small>{p.category?.name || "Uncategorised"}</small></div>
                    <div className="admin-product-price"><strong>{money(p.price)}</strong><span>{Number(p.discount_percent || 0) ? Math.round(Number(p.discount_percent)) + "% off" : "Full price"}</span></div>
                    <div className="admin-product-stock"><strong>{p.total_stock || 0}</strong><span>units</span></div>
                    <div className="admin-row-actions"><button onClick={() => setEditing(p)}>Edit</button><span className={p.published ? "admin-pill success" : "admin-pill"}>{p.published ? "Published" : "Draft"}</span></div>
                  </div>
                ))}
              </div>
            </section>

            <div className="admin-two-column">
              <section className="admin-panel">
                <div className="admin-panel-head"><div><div className="eyebrow">Inventory</div><h2>Size stock</h2></div></div>
                <div className="admin-inventory-grid">
                  {products.map((p) => (
                    <div className="admin-inventory-card" key={p.id}>
                      <strong>{p.name}</strong>
                      <div>{(p.sizes || []).map((s: any) => <label key={s.id}><span>{s.size}</span><input type="number" min="0" value={s.stock_qty} onChange={(e) => updateStock(s.id, e.target.value)} /></label>)}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="admin-panel">
                <div className="admin-panel-head"><div><div className="eyebrow">Taxonomy</div><h2>Categories</h2></div></div>
                <div className="admin-category-list">{categories.map((c) => <div key={c.id}><strong>{c.name}</strong><span>{c.slug}</span></div>)}</div>
                <form className="admin-inline-form" onSubmit={addCategory}><input className="fashion-input" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} placeholder="Category name" required /><input className="fashion-input" value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} placeholder="Description" /><button className="admin-toolbar-btn">Add</button></form>
              </section>
            </div>
          </div>
        )}

        {section === "orders" && (
          <div className="admin-content">
            <div className="admin-toolbar"><input className="fashion-input" placeholder="Search order, customer or phone…" value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} /></div>
            <section className="admin-panel">
              <div className="admin-panel-head"><div><div className="eyebrow">Orders</div><h2>{filteredOrders.length} orders</h2></div></div>
              <div className="admin-order-grid">
                {filteredOrders.map((o) => (
                  <article className="admin-order-card" key={o.id}>
                    <div className="admin-order-card-head"><div><span>{o.order_number}</span><strong>{o.full_name}</strong></div><b>{money(o.total)}</b></div>
                    <div className="admin-order-meta">{o.phone} · {o.area}, {o.city} · {o.address_text}</div>
                    <div className="admin-order-items">{(o.order_items || []).map((item: any) => <div key={item.id}><span>{item.product_name} · {item.size} × {item.quantity}</span><strong>{money(item.subtotal)}</strong></div>)}</div>
                    <div className="admin-order-footer"><span className="admin-pill">{o.payment_method} · {o.payment_status}</span><select className="fashion-select compact" value={o.order_status} onChange={(e) => setOrderStatus(o.id, e.target.value)}>{ORDER_STATUSES.map((s) => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}</select></div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {section === "reviews" && (
          <div className="admin-content">
            <div className="admin-toolbar"><div className="admin-filter-tabs">{["pending","approved","rejected","all"].map((f) => <button key={f} className={reviewFilter === f ? "active" : ""} onClick={() => setReviewFilter(f)}>{f}</button>)}</div></div>
            <section className="admin-panel">
              <div className="admin-panel-head"><div><div className="eyebrow">Moderation</div><h2>{filteredReviews.length} reviews</h2></div></div>
              <div className="admin-review-list">
                {filteredReviews.map((r) => (
                  <article className="admin-review-card" key={r.id}>
                    <div className="review-avatar">{(r.reviewer_name || "C").slice(0,1).toUpperCase()}</div>
                    <div className="review-content"><div className="admin-review-top"><div><strong>{r.reviewer_name || "Customer"}</strong><span>{r.product?.name || "Product"}</span></div><span>★ {r.rating}</span></div><p>{r.review}</p><small>{new Date(r.created_at).toLocaleString()}</small></div>
                    <div className="admin-review-actions">{r.status === "pending" ? <><button className="approve" onClick={() => setReviewStatus(r.id, "approved")}>Approve</button><button className="reject" onClick={() => setReviewStatus(r.id, "rejected")}>Reject</button></> : <span className="admin-pill">{r.status}</span>}</div>
                  </article>
                ))}
                {!filteredReviews.length && <div className="admin-empty">No reviews in this filter.</div>}
              </div>
            </section>
          </div>
        )}

        {section === "customers" && (
          <div className="admin-content">
            <section className="admin-panel">
              <div className="admin-panel-head"><div><div className="eyebrow">Customers</div><h2>{customers.length} profiles</h2></div></div>
              <div className="admin-customer-table">{customers.map((c) => <div className="admin-customer-row" key={c.id}><div className="review-avatar">{(c.full_name || c.username || "C").slice(0,1).toUpperCase()}</div><div><strong>{c.full_name || c.username || "Customer"}</strong><span>{c.phone || "No phone"}</span></div><span>{c.role}</span><small>{new Date(c.created_at).toLocaleDateString()}</small></div>)}</div>
            </section>
          </div>
        )}

        {section === "support" && (
          <div className="admin-content">
            <div className="admin-support-grid">
              <section className="admin-panel">
                <div className="admin-panel-head"><div><div className="eyebrow">Customer care</div><h2>Conversations</h2></div></div>
                <div className="admin-support-list">{conversations.map((c) => <button key={c.id} className={selectedConversation?.id === c.id ? "selected" : ""} onClick={() => setSelectedConversation(c)}><strong>{c.subject || "Support request"}</strong><span>{c.status} · {new Date(c.updated_at).toLocaleString()}</span></button>)}</div>
              </section>
              <section className="admin-panel admin-chat-panel">
                {selectedConversation ? <><div className="admin-panel-head"><div><div className="eyebrow">Conversation</div><h2>{selectedConversation.subject || "Support"}</h2></div></div><div className="admin-message-placeholder">Conversation ID: {selectedConversation.id}<br />Use the reply box below to respond through the live support system.</div><form className="admin-reply-form" onSubmit={sendReply}><textarea className="fashion-input textarea" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply…" required /><button className="checkout-btn">SEND REPLY</button></form></> : <div className="admin-empty">Select a conversation.</div>}
              </section>
            </div>
          </div>
        )}

        {section === "homepage" && (
          <div className="admin-content">
            {bannerDraft ? <form className="admin-panel" onSubmit={saveBanner}><div className="admin-panel-head"><div><div className="eyebrow">Homepage</div><h2>Hero banner</h2></div></div><div className="admin-form-grid"><label><span>Title</span><input className="fashion-input" value={bannerDraft.title || ""} onChange={(e) => setBannerDraft({ ...bannerDraft, title: e.target.value })} /></label><label><span>Subtitle</span><input className="fashion-input" value={bannerDraft.subtitle || ""} onChange={(e) => setBannerDraft({ ...bannerDraft, subtitle: e.target.value })} /></label><label><span>Button text</span><input className="fashion-input" value={bannerDraft.button_text || ""} onChange={(e) => setBannerDraft({ ...bannerDraft, button_text: e.target.value })} /></label><label><span>Button URL</span><input className="fashion-input" value={bannerDraft.button_url || ""} onChange={(e) => setBannerDraft({ ...bannerDraft, button_url: e.target.value })} /></label><label className="wide"><span>Image URL</span><input className="fashion-input" value={bannerDraft.image_url || ""} onChange={(e) => setBannerDraft({ ...bannerDraft, image_url: e.target.value })} /></label></div><button className="checkout-btn small-cta">SAVE HERO</button></form> : <div className="admin-empty">No active banner.</div>}
          </div>
        )}

        {section === "settings" && (
          <div className="admin-content">
            {settingsDraft && <form className="admin-panel" onSubmit={saveSettings}><div className="admin-panel-head"><div><div className="eyebrow">Store</div><h2>General settings</h2></div></div><div className="admin-form-grid"><label><span>Store name</span><input className="fashion-input" value={settingsDraft.store_name || ""} onChange={(e) => setSettingsDraft({ ...settingsDraft, store_name: e.target.value })} /></label><label><span>Currency</span><input className="fashion-input" value={settingsDraft.currency || ""} onChange={(e) => setSettingsDraft({ ...settingsDraft, currency: e.target.value })} /></label><label className="wide"><span>Tagline</span><input className="fashion-input" value={settingsDraft.tagline || ""} onChange={(e) => setSettingsDraft({ ...settingsDraft, tagline: e.target.value })} /></label><label className="wide"><span>Announcement</span><input className="fashion-input" value={settingsDraft.announcement || ""} onChange={(e) => setSettingsDraft({ ...settingsDraft, announcement: e.target.value })} /></label><label><span>Support email</span><input className="fashion-input" value={settingsDraft.support_email || ""} onChange={(e) => setSettingsDraft({ ...settingsDraft, support_email: e.target.value })} /></label><label><span>Support phone</span><input className="fashion-input" value={settingsDraft.support_phone || ""} onChange={(e) => setSettingsDraft({ ...settingsDraft, support_phone: e.target.value })} /></label><label className="wide"><span>Delivery notes</span><textarea className="fashion-input textarea" value={settingsDraft.delivery_notes || ""} onChange={(e) => setSettingsDraft({ ...settingsDraft, delivery_notes: e.target.value })} /></label></div><button className="checkout-btn small-cta">SAVE SETTINGS</button></form>}
          </div>
        )}

        {editing && (
          <div className="admin-modal">
            <div className="admin-modal-card">
              <div className="admin-panel-head"><div><div className="eyebrow">Catalog editor</div><h2>{editing.id ? "Edit product" : "New product"}</h2></div><button onClick={() => setEditing(null)}>Close</button></div>
              <div className="admin-form-grid">
                {["name","slug","sku","team","player","season","league","jersey_type","material","fit"].map((field) => <label key={field}><span>{field.replaceAll("_", " ")}</span><input className="fashion-input" value={editing[field] ?? ""} onChange={(e) => setEditing({ ...editing, [field]: e.target.value })} /></label>)}
                <label><span>Category</span><select className="fashion-select" value={editing.category_id || ""} onChange={(e) => setEditing({ ...editing, category_id: e.target.value })}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
                {["price","original_price","discount_percent","rating","review_count","sold_count","total_stock"].map((field) => <label key={field}><span>{field.replaceAll("_", " ")}</span><input className="fashion-input" type="number" value={editing[field] ?? 0} onChange={(e) => setEditing({ ...editing, [field]: Number(e.target.value) })} /></label>)}
                <label className="wide"><span>Description</span><textarea className="fashion-input textarea" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></label>
                <div className="admin-toggle-grid wide">{[["featured","Featured"],["bestseller","Best seller"],["new_arrival","New arrival"],["published","Published"]].map(([key,label]) => <label key={key}><input type="checkbox" checked={!!editing[key]} onChange={(e) => setEditing({ ...editing, [key]: e.target.checked })}/><span>{label}</span></label>)}</div>
              </div>
              <button className="checkout-btn" onClick={saveProduct}>SAVE PRODUCT</button>
            </div>
          </div>
        )}

        {message && <div className="toast">{message}</div>}
      </main>
    </div>
  );
}
