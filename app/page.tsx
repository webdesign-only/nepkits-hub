"use client";
import {useEffect,useMemo,useState} from "react";
import {createClient, type User} from "@supabase/supabase-js";

const SUPABASE_URL="https://iyfyghzqlcwzyjuqxjlu.supabase.co";
const SUPABASE_KEY="sb_publishable_1JP2P6NgeRAf5ADPjJH78g_KkVa5MzE";
const supabase=createClient(SUPABASE_URL,SUPABASE_KEY);

type Product=any; type CartLine={product:Product,size:string,quantity:number}; type Address=any; type Order=any;
const money=(n:number|string)=>new Intl.NumberFormat("en-NP",{style:"currency",currency:"NPR",maximumFractionDigits:0}).format(Number(n));

export default function Home(){
  const [tab,setTab]=useState("shop"); const [products,setProducts]=useState<Product[]>([]); const [categories,setCategories]=useState<any[]>([]);
  const [user,setUser]=useState<User|null>(null); const [role,setRole]=useState("customer"); const [addresses,setAddresses]=useState<Address[]>([]);
  const [zones,setZones]=useState<any[]>([]); const [orders,setOrders]=useState<Order[]>([]); const [selected,setSelected]=useState<Product|null>(null);
  const [cart,setCart]=useState<CartLine[]>([]); const [q,setQ]=useState(""); const [cat,setCat]=useState(""); const [authMode,setAuthMode]=useState<"login"|"signup">("login");
  const [authOpen,setAuthOpen]=useState(false); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [fullName,setFullName]=useState("");
  const [message,setMessage]=useState(""); const [addressForm,setAddressForm]=useState({full_name:"",phone:"",address_text:"",area:"",city:"Pokhara",delivery_instructions:""});
  const [zoneId,setZoneId]=useState(""); const [payment,setPayment]=useState("cod"); const [busy,setBusy]=useState(false);
  const [wishlist,setWishlist]=useState<string[]>([]); const [adminProducts,setAdminProducts]=useState<Product[]>([]); const [adminOrders,setAdminOrders]=useState<Order[]>([]);
  const [newProduct,setNewProduct]=useState({name:"",slug:"",sku:"",description:"",category_id:"",price:"",original_price:"",image_url:"",team:"NEPKITS",season:"2026"});
  const [review,setReview]=useState({rating:5,review:""}); const [supportText,setSupportText]=useState(""); const [supportOpen,setSupportOpen]=useState(false);

  useEffect(()=>{const c=localStorage.getItem("nk-cart"); if(c) setCart(JSON.parse(c)); loadPublic(); supabase.auth.getSession().then(({data})=>{setUser(data.session?.user??null); if(data.session?.user) loadUser(data.session.user);}); const {data:sub}=supabase.auth.onAuthStateChange((_e,s)=>{setUser(s?.user??null); if(s?.user) loadUser(s.user);}); return()=>sub.subscription.unsubscribe();},[]);
  useEffect(()=>localStorage.setItem("nk-cart",JSON.stringify(cart)),[cart]);
  async function loadPublic(){
    const [p,c,z]=await Promise.all([
      supabase.from("products").select("*,category:categories(name,slug),images:product_images(url,is_primary,sort_order),sizes:product_sizes(id,size,stock_qty,sort_order)").eq("published",true).order("featured",{ascending:false}).order("created_at",{ascending:false}),
      supabase.from("categories").select("id,name,slug").eq("is_active",true).order("sort_order"),
      supabase.from("delivery_zones").select("*").eq("active",true).order("name")
    ]);
    setProducts(p.data??[]); setCategories(c.data??[]); setZones(z.data??[]); if(z.data?.[0]) setZoneId(z.data[0].id);
  }
  async function loadUser(u:User){
    const [p,a,o,w]=await Promise.all([
      supabase.from("profiles").select("full_name,role").eq("id",u.id).maybeSingle(),
      supabase.from("addresses").select("*").eq("user_id",u.id).order("created_at",{ascending:false}),
      supabase.from("orders").select("*,order_items(*)").eq("user_id",u.id).order("created_at",{ascending:false}),
      supabase.from("wishlists").select("product_id").eq("user_id",u.id)
    ]);
    const r=p.data?.role??"customer"; setRole(r); setAddresses(a.data??[]); setOrders(o.data??[]); setWishlist((w.data??[]).map((x:any)=>x.product_id));
    if(a.data?.[0]){setAddressForm({full_name:a.data[0].full_name,phone:a.data[0].phone,address_text:a.data[0].address_text,area:a.data[0].area,city:a.data[0].city,delivery_instructions:a.data[0].delivery_instructions??""});}
    if(r==="admin") loadAdmin();
  }
  async function loadAdmin(){
    const [p,o]=await Promise.all([
      supabase.from("products").select("*,category:categories(name)").order("created_at",{ascending:false}),
      supabase.from("orders").select("*,order_items(*)").order("created_at",{ascending:false}).limit(100)
    ]);
    setAdminProducts(p.data??[]); setAdminOrders(o.data??[]);
  }
  const filtered=useMemo(()=>products.filter(p=>(!q||[p.name,p.team,p.player,p.season,p.league].filter(Boolean).join(" ").toLowerCase().includes(q.toLowerCase()))&&(!cat||p.category_id===cat)),[products,q,cat]);
  const subtotal=useMemo(()=>cart.reduce((s,x)=>s+Number(x.product.price)*x.quantity,0),[cart]);
  function add(product:Product,size:string,qty:number){setCart(v=>{const i=v.findIndex(x=>x.product.id===product.id&&x.size===size); if(i>=0){const n=[...v];n[i]={...n[i],quantity:n[i].quantity+qty};return n;} return [...v,{product,size,quantity:qty}]}); setMessage("Added to cart.");}
  function remove(id:string,size:string){setCart(v=>v.filter(x=>!(x.product.id===id&&x.size===size)))}
  function clearCart(){setCart([]);}
  async function auth(){
    setBusy(true);setMessage("");
    const result=authMode==="login"?await supabase.auth.signInWithPassword({email,password}):await supabase.auth.signUp({email,password,options:{data:{full_name:fullName}}});
    setBusy(false);
    if(result.error){setMessage(result.error.message);return}
    setAuthOpen(false);setMessage(authMode==="signup"?"Account created. Check your email if confirmation is enabled.":"Signed in.");
  }
  async function signOut(){await supabase.auth.signOut();setRole("customer");setOrders([]);setAddresses([]);setWishlist([]);setTab("shop");}
  async function saveAddress(e:any){
    e.preventDefault(); if(!user){setAuthOpen(true);return}
    const {data,error}=await supabase.from("addresses").insert({...addressForm,user_id:user.id,is_default:addresses.length===0}).select().single();
    if(error){setMessage(error.message);return} setAddresses(v=>[data,...v]);setMessage("Address saved.");
  }
  async function checkout(){
    if(!user){setMessage("Please sign in before checkout.");setAuthOpen(true);return}
    if(!addresses[0]){setTab("account");setMessage("Save a delivery address first.");return}
    if(!zoneId){setMessage("Select an active delivery zone.");return}
    const items=cart.map(x=>({product_id:x.product.id,size:x.size,quantity:x.quantity}));
    setBusy(true);setMessage("");
    const {data,error}=await supabase.rpc("place_order",{p_user_id:user.id,p_items:items,p_address_id:addresses[0].id,p_delivery_zone_id:zoneId,p_payment_method:payment,p_coupon_code:null});
    setBusy(false);
    if(error){setMessage(error.message);return}
    clearCart();await loadUser(user);setTab("orders");setMessage("Order "+data.order_number+" created.");
  }
  async function toggleWish(p:Product){
    if(!user){setAuthOpen(true);return}
    if(wishlist.includes(p.id)){await supabase.from("wishlists").delete().eq("user_id",user.id).eq("product_id",p.id);setWishlist(v=>v.filter(x=>x!==p.id));}
    else {await supabase.from("wishlists").insert({user_id:user.id,product_id:p.id});setWishlist(v=>[...v,p.id]);}
  }
  async function addReview(){
    if(!user||!selected){setAuthOpen(true);return}
    const {error}=await supabase.from("reviews").insert({product_id:selected.id,user_id:user.id,rating:review.rating,review:review.review,reviewer_name:fullName||user.email?.split("@")[0]||"Customer"});
    if(error){setMessage(error.message);return} setReview({rating:5,review:""});setMessage("Review submitted for moderation.");
  }
  async function sendSupport(){
    if(!user){setAuthOpen(true);return}
    const {data:c,error:e}=await supabase.from("conversations").insert({user_id:user.id,subject:"Customer support"}).select().single();
    if(e){setMessage(e.message);return}
    const {error}=await supabase.from("messages").insert({conversation_id:c.id,sender_id:user.id,body:supportText});
    if(error){setMessage(error.message);return}setSupportText("");setSupportOpen(false);setMessage("Support message sent.");
  }
  async function createAdminProduct(e:any){
    e.preventDefault();
    const {data:p,error}=await supabase.from("products").insert({name:newProduct.name,slug:newProduct.slug,sku:newProduct.sku,description:newProduct.description,category_id:newProduct.category_id,team:newProduct.team,season:newProduct.season,price:Number(newProduct.price),original_price:newProduct.original_price?Number(newProduct.original_price):null,published:true,featured:true,new_arrival:true,total_stock:40}).select().single();
    if(error){setMessage(error.message);return}
    await supabase.from("product_images").insert({product_id:p.id,url:newProduct.image_url,alt_text:p.name,is_primary:true,sort_order:0});
    await supabase.from("product_sizes").insert(["S","M","L","XL"].map((s,i)=>({product_id:p.id,size:s,stock_qty:10,sort_order:i+1})));
    setMessage("Product created.");setNewProduct({name:"",slug:"",sku:"",description:"",category_id:"",price:"",original_price:"",image_url:"",team:"NEPKITS",season:"2026"});await loadPublic();await loadAdmin();
  }
  async function updateOrder(id:string,status:string){const {error}=await supabase.from("orders").update({order_status:status}).eq("id",id);if(error){setMessage(error.message);return}await loadAdmin();setMessage("Order updated.");}

  return <><nav className="nav"><div className="wrap navin"><a className="brand" href="#"><b>NEP</b>KITS HUB</a><div className="navlinks">{[["shop","Shop"],["cart","Cart ("+cart.reduce((s,x)=>s+x.quantity,0)+")"],["orders","Orders"],["account","Account"],...(role==="admin"?[["admin","Admin"]]:[])].map(([k,label])=><button key={k} className={tab===k?"active":""} onClick={()=>setTab(k)}>{label}</button>)}</div><button className="btn" onClick={()=>user?signOut():setAuthOpen(true)}>{user?"Sign out":"Sign in"}</button></div></nav>
  <main className="wrap">
    {tab==="shop"&&<section className="hero"><div className="heroBox"><div className="eyebrow">NEPKITS HUB</div><div className="display">Football gear for match day.</div><p className="muted">Premium football jerseys, kits and sportswear with live stock, account checkout and order tracking.</p><div className="row" style={{marginTop:18}}><button className="btn primary" onClick={()=>document.getElementById("catalog")?.scrollIntoView({behavior:"smooth"})}>Shop now</button><button className="btn" onClick={()=>setAuthOpen(true)}>{user?"Manage account":"Create account"}</button></div></div></section>}

    {tab==="shop"&&<section id="catalog" className="section"><div className="between"><div><div className="eyebrow">Store</div><h1 className="title">Shop football gear</h1><div className="muted">{filtered.length} live products</div></div><div className="row"><input className="input" style={{minWidth:220}} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search"/></div></div><div className="tabs">{categories.map(c=><button key={c.id} className={"tab "+(cat===c.id?"active":"")} onClick={()=>setCat(cat===c.id?"":c.id)}>{c.name}</button>)}</div>{filtered.length?<div className="grid g4">{filtered.map(p=><article className="card" key={p.id}><div className="img"><img src={p.images?.[0]?.url||""} alt={p.name}/></div><div className="cardbody"><div className="small muted">{p.category?.name||"Football"} · {p.team||"NEPKITS"}</div><h3>{p.name}</h3><div><span className="price">{money(p.price)}</span>{p.original_price&&<span className="old">{money(p.original_price)}</span>}</div><div className="between" style={{marginTop:9}}><span className="small">★ {(Number(p.rating)||0).toFixed(1)}</span><span className="small muted">{Number(p.total_stock)>0?"In stock":"Out of stock"}</span></div><div className="row" style={{marginTop:12}}><button className="btn primary" style={{flex:1}} onClick={()=>setSelected(p)}>View</button><button className="btn" onClick={()=>toggleWish(p)}>{wishlist.includes(p.id)?"♥":"♡"}</button></div></div></article>)}</div>:<div className="panel pad">No products match those filters.</div>}</section>}

    {tab==="cart"&&<section className="section"><div className="eyebrow">Basket</div><h1 className="title">Shopping cart</h1>{cart.length?<div className="grid g2" style={{marginTop:18}}><div className="stack">{cart.map((x,i)=><div className="item" key={i}><div className="between"><div><strong>{x.product.name}</strong><div className="small muted">Size {x.size} · {money(x.product.price)} each</div></div><button className="btn danger" onClick={()=>remove(x.product.id,x.size)}>Remove</button></div><div className="row" style={{marginTop:10}}><button className="btn" onClick={()=>setCart(v=>v.map(y=>y===x?{...y,quantity:Math.max(1,y.quantity-1)}:y))}>−</button><span>{x.quantity}</span><button className="btn" onClick={()=>setCart(v=>v.map(y=>y===x?{...y,quantity:y.quantity+1}:y))}>+</button></div></div>)}</div><div className="panel pad"><div className="between"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="muted small" style={{marginTop:8}}>Delivery is calculated from your selected zone.</div><select className="select" value={zoneId} onChange={e=>setZoneId(e.target.value)} style={{marginTop:12}}>{zones.map(z=><option key={z.id} value={z.id}>{z.name} — {money(z.delivery_fee)}</option>)}</select><div className="row" style={{marginTop:10}}><button className={"btn "+(payment==="cod"?"primary":"")} onClick={()=>setPayment("cod")}>Cash on delivery</button><button className={"btn "+(payment==="esewa"?"primary":"")} onClick={()=>setPayment("esewa")}>eSewa</button></div><button className="btn primary" style={{width:"100%",marginTop:14}} disabled={busy} onClick={checkout}>{busy?"Creating order…":"Place order"}</button></div></div>:<div className="panel pad" style={{marginTop:18}}>Your cart is empty. <button className="btn primary" onClick={()=>setTab("shop")}>Browse products</button></div>}</section>}

    {tab==="account"&&<section className="section"><div className="eyebrow">Account</div><h1 className="title">Your profile</h1>{user?<div className="grid g2" style={{marginTop:18}}><div className="panel pad"><div className="between"><h3>Signed in</h3><span className="small muted">{user.email}</span></div><form className="stack" onSubmit={saveAddress}><input className="input" value={addressForm.full_name} onChange={e=>setAddressForm({...addressForm,full_name:e.target.value})} placeholder="Full name" required/><input className="input" value={addressForm.phone} onChange={e=>setAddressForm({...addressForm,phone:e.target.value})} placeholder="Phone" required/><input className="input" value={addressForm.address_text} onChange={e=>setAddressForm({...addressForm,address_text:e.target.value})} placeholder="Address" required/><div className="grid g2"><input className="input" value={addressForm.area} onChange={e=>setAddressForm({...addressForm,area:e.target.value})} placeholder="Area" required/><input className="input" value={addressForm.city} onChange={e=>setAddressForm({...addressForm,city:e.target.value})} placeholder="City" required/></div><textarea className="area" value={addressForm.delivery_instructions} onChange={e=>setAddressForm({...addressForm,delivery_instructions:e.target.value})} placeholder="Delivery instructions"/><button className="btn primary">Save address</button></form></div><div className="panel pad"><h3>Saved addresses</h3>{addresses.length?<div className="list">{addresses.map(a=><div className="item" key={a.id}><strong>{a.full_name}</strong><div className="small muted">{a.phone}</div><div className="small">{a.address_text}, {a.area}, {a.city}</div></div>)}</div>:<div className="muted">No address saved yet.</div>}<div className="notice" style={{marginTop:14}}>Delivery: {zones.map(z=>z.name+" ("+money(z.delivery_fee)+")").join(", ")||"configured by store"}.</div></div></div>:<div className="panel pad">Sign in to manage your profile and addresses. <button className="btn primary" onClick={()=>setAuthOpen(true)}>Sign in</button></div>}</section>}

    {tab==="orders"&&<section className="section"><div className="eyebrow">Account</div><h1 className="title">Orders</h1>{user?(orders.length?<div className="list" style={{marginTop:18}}>{orders.map(o=><div className="item" key={o.id}><div className="between"><div><strong>{o.order_number}</strong><div className="small muted">{new Date(o.created_at).toLocaleString()} · {o.order_status.replaceAll("_"," ")}</div></div><strong>{money(o.total)}</strong></div><div className="small muted" style={{marginTop:7}}>Payment: {o.payment_status} · {o.payment_method}</div><div className="list" style={{marginTop:10}}>{(o.order_items??[]).map((it:any)=><div className="small" key={it.id}>{it.product_name} · {it.size} × {it.quantity}</div>)}</div></div>)}</div>:<div className="panel pad">No orders yet. <button className="btn primary" onClick={()=>setTab("shop")}>Start shopping</button></div>):<div className="panel pad">Sign in to see your orders.</div>}</section>}

    {tab==="admin"&&role==="admin"&&<section className="section"><div className="eyebrow">Admin</div><h1 className="title">Store operations</h1><div className="tabs"><button className="tab active">Products</button><button className="tab" onClick={()=>setSupportOpen(true)}>Support</button></div><div className="grid g2"><div className="panel pad"><h3>Add product</h3><form className="stack" onSubmit={createAdminProduct}><input className="input" value={newProduct.name} onChange={e=>setNewProduct({...newProduct,name:e.target.value})} placeholder="Product name" required/><input className="input" value={newProduct.slug} onChange={e=>setNewProduct({...newProduct,slug:e.target.value})} placeholder="Slug" required/><input className="input" value={newProduct.sku} onChange={e=>setNewProduct({...newProduct,sku:e.target.value})} placeholder="SKU" required/><select className="select" value={newProduct.category_id} onChange={e=>setNewProduct({...newProduct,category_id:e.target.value})} required><option value="">Category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><div className="grid g2"><input className="input" value={newProduct.price} onChange={e=>setNewProduct({...newProduct,price:e.target.value})} placeholder="Price" required/><input className="input" value={newProduct.original_price} onChange={e=>setNewProduct({...newProduct,original_price:e.target.value})} placeholder="Original price"/></div><input className="input" value={newProduct.image_url} onChange={e=>setNewProduct({...newProduct,image_url:e.target.value})} placeholder="Product image URL" required/><textarea className="area" value={newProduct.description} onChange={e=>setNewProduct({...newProduct,description:e.target.value})} placeholder="Description"/><button className="btn primary">Publish product</button></form></div><div className="panel pad"><h3>Orders</h3><div className="list">{adminOrders.map(o=><div className="item" key={o.id}><div className="between"><strong>{o.order_number}</strong><select className="select" style={{maxWidth:180}} value={o.order_status} onChange={e=>updateOrder(o.id,e.target.value)}>{["placed","confirmed","processing","packed","shipped","out_for_delivery","delivered","cancelled"].map(s=><option key={s} value={s}>{s.replaceAll("_"," ")}</option>)}</select></div><div className="small muted">{money(o.total)} · {o.payment_method}</div></div>)}</div></div></div></section>}

    {message&&<div className="notice" style={{position:"fixed",right:18,bottom:18,maxWidth:420,zIndex:30}}>{message}</div>}
  </main>

  {selected&&<div className="modal" onMouseDown={e=>{if(e.currentTarget===e.target)setSelected(null)}}><div className="modalbox"><div className="between"><h2>{selected.name}</h2><button className="btn" onClick={()=>setSelected(null)}>Close</button></div><div className="grid g2" style={{marginTop:14}}><div className="img"><img src={selected.images?.[0]?.url||""} alt={selected.name}/></div><div className="stack"><div className="muted">{selected.category?.name} · {selected.team}</div><p>{selected.description}</p><div><span className="price">{money(selected.price)}</span></div><div><strong>Size</strong><div className="row" style={{flexWrap:"wrap",marginTop:8}}>{(selected.sizes??[]).map((s:any)=><button key={s.id} className="size sel" disabled={s.stock_qty<1} onClick={()=>{const n=prompt("Quantity?","1");const qty=Math.max(1,Number(n)||1);add(selected,s.size,Math.min(qty,s.stock_qty));}}>{s.size} · {s.stock_qty}</button>)}</div></div><div className="panel pad"><div className="small muted">Wishlist</div><button className="btn" onClick={()=>toggleWish(selected)}>{wishlist.includes(selected.id)?"Remove from wishlist":"Save to wishlist"}</button></div><div className="panel pad"><h3>Review</h3><div className="row"><select className="select" value={review.rating} onChange={e=>setReview({...review,rating:Number(e.target.value)})}><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select></div><textarea className="area" value={review.review} onChange={e=>setReview({...review,review:e.target.value})} placeholder="Share your experience" style={{marginTop:8}}/><button className="btn primary" onClick={addReview}>Submit review</button></div></div></div></div></div>}

  {supportOpen&&<div className="modal"><div className="modalbox"><div className="between"><h2>Customer support</h2><button className="btn" onClick={()=>setSupportOpen(false)}>Close</button></div><p className="muted">Send a message linked to your account.</p><textarea className="area" value={supportText} onChange={e=>setSupportText(e.target.value)} placeholder="How can we help?"/><button className="btn primary" style={{marginTop:10}} onClick={sendSupport}>Send</button></div></div>}

  {authOpen&&<div className="modal"><div className="modalbox"><div className="between"><h2>{authMode==="login"?"Sign in":"Create account"}</h2><button className="btn" onClick={()=>setAuthOpen(false)}>Close</button></div>{authMode==="signup"&&<input className="input" style={{marginTop:12}} value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Full name" /> }<input className="input" style={{marginTop:12}} value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"/><input className="input" style={{marginTop:10}} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"/><button className="btn primary" style={{width:"100%",marginTop:12}} disabled={busy} onClick={auth}>{busy?"Please wait…":authMode==="login"?"Sign in":"Create account"}</button><button className="btn" style={{width:"100%",marginTop:8}} onClick={()=>setAuthMode(authMode==="login"?"signup":"login")}>{authMode==="login"?"Need an account? Sign up":"Already have an account? Sign in"}</button></div></div>}
  </>;
}