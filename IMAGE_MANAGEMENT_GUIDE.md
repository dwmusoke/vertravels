# Image Management System for VerTravels

## Overview

This document explains the new image management system that replaces emojis with proper images across the VerTravels platform. Admins can now upload and manage images for destinations, tour categories, and other content.

## Problem Solved

**Before:** The platform used hardcoded emojis (🦁, 🏛️, 🏖️, etc.) for tour categories and destinations, which:
- Looked unprofessional
- Couldn't be customized
- Varied across different devices/OS
- Limited branding opportunities

**After:** Admins can now upload custom images from the Admin panel that:
- Display consistently across all platforms
- Can be branded and customized
- Look professional
- Can be updated anytime

## Database Changes

### 1. Storage Buckets (Migration 0012)

Created Supabase storage buckets for different image types:

```sql
- destination-images  → Destination photos
- tour-images        → Tour activity photos
- hotel-images       → Hotel photos
- car-images         → Car fleet photos
- category-icons     → Category icons/logos
- blog-images        → Blog post images
- cms-images         → CMS page images
```

All buckets:
- Are **public** (images can be viewed by anyone)
- Support JPEG, PNG, WebP formats
- Have 10MB file size limit (5MB for icons)
- Require authentication to upload/delete

### 2. Destinations Table (Migration 0012b)

```sql
CREATE TABLE destinations (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    image_url TEXT,              -- Stores uploaded image URL
    flights_count INTEGER DEFAULT 0,
    hotels_count INTEGER DEFAULT 0,
    price_from VARCHAR(50),
    featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### 3. Tour Categories Table (Migration 0012c)

```sql
CREATE TABLE tour_categories (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon_emoji VARCHAR(10),           -- Old emoji (fallback)
    icon_image_url TEXT,              -- New uploaded icon
    color_from VARCHAR(50),           -- Gradient colors
    color_to VARCHAR(50),
    background_image_url TEXT,        -- Optional background
    display_order INTEGER DEFAULT 0,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## Admin Features

### 1. Image Upload Component

Located: `apps/admin/components/ui/image-upload.tsx`

**Features:**
- Drag and drop support
- Click to upload
- Multiple file upload (optional)
- File size validation (max 10MB)
- Image preview
- Remove/delete functionality
- Loading states
- Error handling

**Usage Example:**
```tsx
<ImageUpload
  bucket="destination-images"
  onUpload={(url) => setImageUrl(url)}
  existingImages={imageUrl ? [imageUrl] : []}
  onRemove={() => setImageUrl(null)}
  multiple={false}
  maxImages={1}
/>
```

### 2. Destinations Management Page

**URL:** `/admin/destinations`

**Features:**
- View all destinations in a grid
- Add new destinations
- Edit destination details (name, country, price, etc.)
- Upload destination images
- Mark as featured
- Delete destinations (with image cleanup)
- Set display order

**How to Use:**
1. Navigate to Admin → Content → Destinations
2. Click "Add Destination" to create new
3. Click "Edit" on any destination card
4. Upload an image using the upload component
5. Click "Save" to apply changes

### 3. Tour Categories Management

**URL:** `/admin/tour-categories`

**Features:**
- View all tour categories
- Add new categories
- Upload custom icon images (replaces emoji)
- Upload background images
- Change color schemes
- Set display order
- Enable/disable categories

**How to Use:**
1. Navigate to Admin → Content → Tour Categories
2. Click "Add Category" to create new
3. Click "Edit" on any category
4. Upload an icon image (this replaces the emoji)
5. Optionally upload a background image
6. Choose a color scheme
7. Click "Save"

## Frontend Integration

### Updating the Home Page

The home page (`apps/web/app/page.tsx`) currently uses hardcoded emojis. Here's how to update it:

```tsx
// OLD - Using emojis
const popularDestinations = [
  {
    id: 1,
    name: "Dubai",
    country: "UAE",
    emoji: "🏙️",  // ❌ Emoji
    // ...
  },
];

// NEW - Fetch from database
// Fetch destinations from Supabase and use image_url
const { data: destinations } = await supabase
  .from("destinations")
  .select("*")
  .eq("featured", true)
  .order("display_order");

// In your JSX:
{destinations?.map((dest) => (
  <div key={dest.id}>
    {dest.image_url ? (
      <img src={dest.image_url} alt={dest.name} className="w-full h-48 object-cover" />
    ) : (
      <span>{dest.emoji}</span> // Fallback
    )}
    <h3>{dest.name}</h3>
  </div>
))}
```

### Updating the Tours Page

The tours page (`apps/web/app/tours/page.tsx`) can be updated similarly:

```tsx
// Fetch tour categories from database
const { data: categories } = await supabase
  .from("tour_categories")
  .select("*")
  .eq("status", true)
  .order("display_order");

// In your JSX:
{categories?.map((cat) => (
  <div key={cat.id}>
    <div className={`bg-gradient-to-r ${cat.color_from} ${cat.color_to}`}>
      {cat.icon_image_url ? (
        <img src={cat.icon_image_url} alt={cat.name} className="w-20 h-20" />
      ) : cat.icon_emoji ? (
        <span>{cat.icon_emoji}</span> // Fallback to emoji
      ) : null}
    </div>
    <h3>{cat.name}</h3>
  </div>
))}
```

## Running the Migrations

Apply the database migrations in order:

```bash
# Connect to your Supabase database
psql -h <host> -U postgres -d postgres

# Run migrations
\i packages/database/migrations/0012-image-storage.sql
\i packages/database/migrations/0012b-destinations-table.sql
\i packages/database/migrations/0012c-tour-categories.sql
```

Or use the Supabase Dashboard:
1. Go to SQL Editor
2. Copy the contents of each migration file
3. Run them in order

## Image URLs

Once uploaded, images are accessible via public URLs:

```
https://<your-project-id>.supabase.co/storage/v1/object/public/<bucket>/<path>

Example:
https://kjsxtfweybttvqoafptc.supabase.co/storage/v1/object/public/destination-images/dubai-skyline.jpg
```

## Best Practices

### Image Specifications

**Destination Images:**
- Recommended size: 1200x800px
- Format: JPEG or WebP
- Max size: 10MB
- Aspect ratio: 3:2

**Category Icons:**
- Recommended size: 512x512px
- Format: PNG with transparency or SVG
- Max size: 5MB
- Square format

**Tour/Hotel Images:**
- Recommended size: 1200x800px
- Format: JPEG or WebP
- Max size: 10MB
- Multiple images per item

### File Naming

The system automatically generates unique filenames:
```
<timestamp>-<random-string>.<ext>
Example: 1715184000000-a3f8b2c.jpg
```

### Performance Tips

1. **Optimize images before upload** - Use tools like TinyPNG
2. **Use WebP format** - Better compression than JPEG
3. **Implement lazy loading** - For image galleries
4. **Consider CDN** - Supabase storage includes CDN

## Troubleshooting

### "Failed to upload" Error

**Causes:**
- File too large (>10MB)
- Wrong file type
- Authentication issue
- Bucket doesn't exist

**Solutions:**
1. Check file size and format
2. Ensure user is logged in
3. Verify migrations were run successfully
4. Check browser console for detailed errors

### Images Not Displaying

**Causes:**
- Incorrect URL
- CORS issue
- Permission problem

**Solutions:**
1. Verify the URL is correct (should start with `https://`)
2. Check that the bucket is public
3. Try opening the image URL directly in browser

## Next Steps

1. ✅ Run database migrations
2. ✅ Test image upload in Admin
3. ⏳ Update frontend pages to use database images:
   - Home page destinations
   - Tours page categories
   - Any other pages using hardcoded images
4. ⏳ Migrate existing emoji data to new system
5. ⏳ Add image optimization pipeline

## Support

For issues or questions:
- Check the Supabase Storage dashboard
- Review browser console for errors
- Verify database migration status
- Contact the development team
