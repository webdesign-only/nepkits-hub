import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase=createClient(
  'https://iyfyghzqlcwzyjuqxjlu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5ZnlnbHpxbGN3enlqdXF4amx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzQzMjgsImV4cCI6MjEwNTkxMDMyOH0.w8B4QgZM1NytGm709lc-Aui5x-DV5VjTzW8JJDVIzr4'
);

async function loadProduct(product:any){
  const [{data:images},{data:sizes}] = await Promise.all([
    supabase.from('product_images').select('id,url,alt_text,sort_order,is_primary').eq('product_id',product.id).order('sort_order'),
    supabase.from('product_sizes').select('id,size,stock_qty,sort_order').eq('product_id',product.id).order('sort_order')
  ]);
  return {...product,images:images??[],sizes:sizes??[]};
}

export async function GET(request:Request){
  try{
    const url=new URL(request.url);
    const slug=url.searchParams.get('slug');

    if(slug){
      const {data:product,error}=await supabase.from('products').select('*,category:categories(id,name,slug)').eq('slug',slug).eq('published',true).maybeSingle();
      if(error) throw error;
      if(!product) return NextResponse.json({product:null},{status:404});
      return NextResponse.json({product:await loadProduct(product)},{headers:{'Cache-Control':'no-store'}});
    }

    const [{data:products,error:productsError},{data:categories,error:categoriesError}] = await Promise.all([
      supabase.from('products').select('*').eq('published',true).order('featured',{ascending:false}).order('created_at',{ascending:false}),
      supabase.from('categories').select('*').eq('is_active',true).order('sort_order')
    ]);
    if(productsError) throw productsError;
    if(categoriesError) throw categoriesError;

    const hydrated=await Promise.all((products??[]).map(loadProduct));
    return NextResponse.json({products:hydrated,categories:categories??[]},{headers:{'Cache-Control':'no-store'}});
  }catch(error:any){
    console.error('NEPKITS catalog API error',error);
    return NextResponse.json({error:error?.message||'Catalog unavailable'},{status:500,headers:{'Cache-Control':'no-store'}});
  }
}