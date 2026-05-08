# Quick Start: Image Management Setup

## What Was Fixed

✅ **Problem:** Platform was using emojis (🦁, 🏛️, 🏖️) instead of proper images
✅ **Solution:** Created complete image upload/management system in Admin panel

## Files Created

### 1. Database Migrations
- `packages/database/migrations/0012-image-storage.sql` - Storage buckets
- `packages/database/migrations/0012b-destinations-table.sql` - Destinations table
- `packages/database/migrations/0012c-tour-categories.sql` - Tour categories table

### 2. Admin Components
- `apps/admin/components/ui/image-upload.tsx` - Reusable upload component
- `apps/admin/app/destinations/page.tsx` - Destinations management
- `apps/admin/app/tour-categories/page.tsx` - Tour categories management

### 3. Admin Navigation
- Updated `apps/admin/components/layout/admin-sidebar.tsx` - Added Content menu

### 4. Documentation
- `IMAGE_MANAGEMENT_GUIDE.md` - Complete guide
- `setup-image-storage.ps1` - Windows setup script
- `setup-image-storage.sh` - Linux/Mac setup script

## Setup Steps

### Step 1: Run Database Migrations

**Option A: Using Supabase Dashboard (Easiest)**

1. Open your Supabase project: https://supabase.com/dashboard/project/kjsxtfweybttvqoafptc
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy contents from `packages/database/migrations/0012-image-storage.sql`
5. Paste and click **Run**
6. Repeat for `0012b-destinations-table.sql` and `0012c-tour-categories.sql`

**Option B: Using PowerShell Script**

```powershell
.\setup-image-storage.ps1
```

This will guide you through the process.

### Step 2: Access Admin Panel

1. Start your admin app:
   ```bash
   cd apps/admin
   npm run dev
   ```

2. Navigate to: `http://localhost:3001/admin` (or your admin URL)

### Step 3: Upload Destination Images

1. Click **Content** → **Destinations** in the sidebar
2. You'll see existing destinations (from migration)
3. Click **Edit** on any destination
4. In the edit mode, you'll see an image upload area
5. Click or drag to upload an image
6. Click **Save**

### Step 4: Upload Tour Category Icons

1. Click **Content** → **Tour Categories** in the sidebar
2. You'll see categories: Safari, Cultural, Adventure, Beach
3. Click **Edit** on any category
4. Upload a custom icon image (replaces the emoji)
5. Optionally upload a background image
6. Click **Save**

## How to Use Uploaded Images

### In Your Frontend Code

**Before (using emojis):**
```tsx
const categories = [
  { name: "Safari", icon: "🦁" }  // ❌ Emoji
];

<div>{category.icon}</div>
```

**After (using uploaded images):**
```tsx
// Fetch from database
const { data: categories } = await supabase
  .from("tour_categories")
  .select("*");

// Display
<div>
  {category.icon_image_url ? (
    <img src={category.icon_image_url} alt={category.name} />  // ✅ Image
  ) : (
    <span>{category.icon_emoji}</span>  // Fallback
  )}
</div>
```

## Features

### Image Upload Component
- ✅ Drag and drop support
- ✅ Click to browse
- ✅ Multiple file upload
- ✅ File validation (size, type)
- ✅ Preview uploaded images
- ✅ Remove/delete images
- ✅ Loading states

### Destinations Management
- ✅ Add/Edit/Delete destinations
- ✅ Upload destination images
- ✅ Mark as featured
- ✅ Set display order
- ✅ Manage flights/hotels count

### Tour Categories Management
- ✅ Add/Edit/Delete categories
- ✅ Upload icon images (replaces emojis)
- ✅ Upload background images
- ✅ Choose color schemes
- ✅ Set display order
- ✅ Enable/disable categories

## Image Storage Details

### Storage Buckets Created
- `destination-images` - For destination photos
- `tour-images` - For tour photos
- `hotel-images` - For hotel photos
- `car-images` - For car photos
- `category-icons` - For category icons
- `blog-images` - For blog images
- `cms-images` - For CMS images

### File Specifications
- **Max size:** 10MB (5MB for icons)
- **Formats:** JPEG, PNG, WebP, SVG (icons)
- **Access:** Public (viewable by anyone)
- **Upload:** Authenticated users only

## Example: Update Home Page

Here's how to update your home page to use database images:

```tsx
// apps/web/app/page.tsx

// 1. Fetch destinations from database
const supabase = createClient();
const { data: destinations } = await supabase
  .from("destinations")
  .select("*")
  .where("featured", "=", true)
  .order("display_order");

// 2. Replace hardcoded array with fetched data
// OLD:
const popularDestinations = [
  { name: "Dubai", emoji: "🏙️" },  // ❌
];

// NEW:
// Use {destinations?.map(...)} instead

// 3. In your JSX:
{destinations?.map((dest) => (
  <div key={dest.id}>
    {dest.image_url ? (
      <img 
        src={dest.image_url} 
        alt={dest.name}
        className="w-full h-48 object-cover"
      />
    ) : null}
    <h3>{dest.name}</h3>
    <p>{dest.country}</p>
  </div>
))}
```

## Troubleshooting

### "Bucket does not exist"
- Run the migration `0012-image-storage.sql` first

### "Failed to upload"
- Check file size (max 10MB)
- Check file type (must be image)
- Ensure you're logged in to admin

### Images not showing
- Check if URL is correct
- Try opening URL directly in browser
- Verify bucket is public in Supabase Storage

## Next Actions

1. ✅ Run the 3 migration files in Supabase
2. ✅ Test uploading a destination image
3. ✅ Test uploading a tour category icon
4. ⏳ Update frontend pages to use database images
5. ⏳ Remove hardcoded emoji arrays

## Support

- Full documentation: `IMAGE_MANAGEMENT_GUIDE.md`
- Supabase Dashboard: https://supabase.com/dashboard
- Check browser console for errors
- Verify migrations ran successfully in Supabase SQL
