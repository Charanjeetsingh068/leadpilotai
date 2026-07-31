export class IntegrationQueue {
  private queue: any[] = [];

  async addJob(jobName: string, payload: any) {
    const job = { id: `job-${Date.now()}`, jobName, payload, status: 'QUEUED', createdAt: new Date() };
    this.queue.push(job);
    return job;
  }

  async getJobs() {
    return this.queue;
  }
}
