import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route for On-Demand Revalidation
 * Called by Sanity webhooks when content changes
 * 
 * Setup in Sanity:
 * 1. Go to https://www.sanity.io/manage
 * 2. Select your project
 * 3. Go to API → Webhooks
 * 4. Create webhook with URL: https://your-domain.com/api/revalidate?secret=YOUR_SECRET
 * 5. Set secret in Vercel: REVALIDATION_SECRET
 */

export async function POST(request: NextRequest) {
  try {
    // Verify the request is from Sanity using a secret token
    const secret = request.nextUrl.searchParams.get('secret');
    
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const body = await request.json();
    
    // Get the document type from the webhook payload
    const documentType = body._type;
    
    console.log(`[Revalidation] Received webhook for type: ${documentType}`);

    // Revalidate all pages that depend on this content
    if (documentType === 'project') {
      // Revalidate homepage (shows all projects)
      revalidatePath('/');
      console.log('[Revalidation] Homepage revalidated');
      
      // Revalidate all project pages
      revalidatePath('/projects/[slug]', 'page');
      console.log('[Revalidation] All project pages revalidated');
      
      // If slug is provided, revalidate specific project
      if (body.slug?.current) {
        revalidatePath(`/projects/${body.slug.current}`);
        console.log(`[Revalidation] Project ${body.slug.current} revalidated`);
      }
    } else if (documentType === 'about') {
      // Revalidate all pages (about info is in layout/menu)
      revalidatePath('/', 'layout');
      console.log('[Revalidation] Layout revalidated (about section)');
    } else {
      // Unknown type, revalidate everything to be safe
      revalidatePath('/', 'layout');
      console.log('[Revalidation] All pages revalidated (unknown type)');
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type: documentType,
    });
  } catch (error) {
    console.error('[Revalidation] Error:', error);
    return NextResponse.json(
      { 
        message: 'Error revalidating',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Allow GET for testing
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json(
      { message: 'Invalid secret' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: 'Revalidation endpoint is working',
    note: 'Use POST request from Sanity webhook to trigger revalidation'
  });
}

