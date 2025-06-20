import { NextRequest, NextResponse } from 'next/server';
import { sendEvent } from '@/app/api/lib/socket/send-event';
import { getSosChannelName, SOS_STOPPED } from '../utils';
import { UserTable } from '../../../(graphql)/User/db';
import { db } from '../../../lib/db';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const userId = Number(request.headers.get('x-user-id'));
    if (!userId) {
      console.error('No x-user-id header found');
      return NextResponse.json({ error: 'User ID header missing' }, { status: 400 });
    }
    const [user] = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.id, userId))
      .limit(1);
    if (!user) {
      console.error('User not found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 404 });
    }

    await sendEvent([{
      channel: getSosChannelName(user.id),
      name: SOS_STOPPED,
      data: {
        userId: user.id,
        timestamp: new Date().toISOString(),
      },
    }]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('SOS stop error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}