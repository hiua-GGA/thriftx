import { MetadataRoute } from 'next';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL from environment variable or default
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thriftx.com';
  
  // Static routes with their last modified date and change frequency
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as ChangeFrequency,
      priority: 0.5,
    },
  ];

  // Fetch dynamic routes from API
  // In production, you would fetch these from your API or database
  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    // Example: Fetch product slugs from API
    const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/slugs`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (productsRes.ok) {
      const products = await productsRes.json();
      
      // Map products to sitemap entries
      const productRoutes = products.map((product: { slug: string; updatedAt: string }) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product.updatedAt),
        changeFrequency: 'weekly' as ChangeFrequency,
        priority: 0.8,
      }));
      
      dynamicRoutes = [...dynamicRoutes, ...productRoutes];
    }
    
    // Example: Fetch category slugs from API
    const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/slugs`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (categoriesRes.ok) {
      const categories = await categoriesRes.json();
      
      // Map categories to sitemap entries
      const categoryRoutes = categories.map((category: { slug: string; updatedAt: string }) => ({
        url: `${baseUrl}/shop/${category.slug}`,
        lastModified: new Date(category.updatedAt),
        changeFrequency: 'weekly' as ChangeFrequency,
        priority: 0.7,
      }));
      
      dynamicRoutes = [...dynamicRoutes, ...categoryRoutes];
    }
    
    // Example: Fetch blog post slugs from API
    const blogPostsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/slugs`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (blogPostsRes.ok) {
      const blogPosts = await blogPostsRes.json();
      
      // Map blog posts to sitemap entries
      const blogRoutes = blogPosts.map((post: { slug: string; updatedAt: string }) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'monthly' as ChangeFrequency,
        priority: 0.6,
      }));
      
      dynamicRoutes = [...dynamicRoutes, ...blogRoutes];
    }
  } catch (error) {
    console.error('Error generating dynamic sitemap routes:', error);
    // Continue with static routes if dynamic routes fail
  }

  // Combine static and dynamic routes
  return [...staticRoutes, ...dynamicRoutes];
} 