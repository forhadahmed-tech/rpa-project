import { NextResponse } from 'next/server';
import { getAllQueues, getJobsByStatus } from "../../../../../libs/redis/queue";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'completed';
    const queueName = searchParams.get('queue') || 'excelQueue';
    const page = parseInt(searchParams.get('page') || '0');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');

    const queues = getAllQueues();
    const queue = queues[queueName as keyof typeof queues];

    if (!queue) {
      return NextResponse.json(
        { error: `Queue ${queueName} not found` },
        { status: 404 }
      );
    }

    const jobs = await getJobsByStatus(queue, status, page, pageSize);

    console.log("jobs", jobs)

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        pageSize,
        status,
        queue: queueName,
      },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}