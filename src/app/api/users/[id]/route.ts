import { withApiErrorHandler } from '@/lib/errors/apiHandlers';
import { userService } from '@/lib/services/user.service';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withApiErrorHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;
    const user = await userService.getUserByEmail(id);
    return NextResponse.json(user);
  }
);

export const PUT = withApiErrorHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;
    const body = await request.json();
    const user = await userService.updateUser({
      ...body,
      id,
    });

    return NextResponse.json(user);
  }
);
