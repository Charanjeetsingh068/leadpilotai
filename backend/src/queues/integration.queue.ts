import { Queue, Worker } from 'bullmq';
import { ENV } from '../config/env';
import { logMetaEvent } from '../services/meta-graph-api.service';

export class IntegrationQueue {
  private queue: Queue | null = null;
  private worker: Worker | null = null;
  private inMemoryQueue: Array<{ id: string; name: string; data: any; status: string }> = [];

  constructor() {
    try {
      const connection = {
        host: ENV.REDIS_HOST || 'localhost',
        port: ENV.REDIS_PORT || 6379,
      };

      this.queue = new Queue('meta-integration-queue', { connection });
      this.worker = new Worker(
        'meta-integration-queue',
        async (job) => {
          logMetaEvent(`[BullMQ Worker Processing Job: ${job.name}]`, { id: job.id, data: job.data });
          return { status: 'completed', processedAt: new Date().toISOString() };
        },
        { connection }
      );

      this.worker.on('failed', (job, err) => {
        logMetaEvent(`[BullMQ Job Failed: ${job?.name}]`, { id: job?.id, error: err.message });
      });
    } catch (e: any) {
      logMetaEvent('Redis Connection Unavailable. Falling back to In-Memory Queue.', { error: e.message });
    }
  }

  async addJob(jobName: string, payload: any) {
    if (this.queue) {
      try {
        const job = await this.queue.add(jobName, payload, {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
        });
        return { id: job.id, name: jobName, payload, status: 'QUEUED' };
      } catch (err: any) {
        logMetaEvent('BullMQ addJob Warning. Using In-Memory Fallback.', { error: err.message });
      }
    }

    const memJob = {
      id: `mem-job-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: jobName,
      data: payload,
      status: 'QUEUED',
      createdAt: new Date(),
    };
    this.inMemoryQueue.push(memJob);
    return memJob;
  }

  async getJobs() {
    if (this.queue) {
      try {
        const jobs = await this.queue.getJobs(['waiting', 'active', 'completed', 'failed']);
        return jobs.map((j) => ({ id: j.id, name: j.name, data: j.data, status: j.getState() }));
      } catch (e) {}
    }
    return this.inMemoryQueue;
  }
}

export const integrationQueue = new IntegrationQueue();
