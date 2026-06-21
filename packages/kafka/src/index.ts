// ============================================================================
// Kafka producer/consumer factory + canonical topic registry (Master Prompt
// "KAFKA EVENT CONTRACT" / Tech Specs §10.1). Partition by org_id at publish.
// ============================================================================
import { Kafka, type Consumer, type Producer } from 'kafkajs';

export const TOPICS = {
  CANDIDATE_CREATED: 'candidate.created',
  CV_UPLOADED: 'cv.uploaded',
  CV_PARSED: 'cv.parsed',
  PROFILE_UPDATED: 'profile.updated',
  EMBEDDING_GENERATED: 'embedding.generated',
  JD_PUBLISHED: 'jd.published',
  APPLICATION_SUBMITTED: 'application.submitted',
  APPLICATION_STAGE_CHANGED: 'application.stage_changed',
  APPLICATION_RESCORED: 'application.rescored',
  CALL_INITIATED: 'call.initiated',
  CALL_COMPLETED: 'call.completed',
  INTERVIEW_SCHEDULED: 'interview.scheduled',
  INTERVIEW_NO_SHOW: 'interview.no_show',
  NOTIFICATION_SEND: 'notification.send',
  GDPR_ERASURE_REQUESTED: 'gdpr.erasure_requested',
} as const;

export type Topic = (typeof TOPICS)[keyof typeof TOPICS];

export interface KafkaEvent<T = unknown> {
  topic: Topic;
  /** Partition key — ALWAYS org_id where applicable (NFR scalability). */
  key: string;
  payload: T;
  occurred_at: string;
}

export function createKafka(clientId: string, brokers: string[]): Kafka {
  return new Kafka({ clientId, brokers, retry: { retries: 5 } });
}

export async function createProducer(kafka: Kafka): Promise<Producer> {
  const producer = kafka.producer({ allowAutoTopicCreation: true });
  await producer.connect();
  return producer;
}

export async function publish<T>(producer: Producer, event: KafkaEvent<T>): Promise<void> {
  await producer.send({
    topic: event.topic,
    messages: [{ key: event.key, value: JSON.stringify(event) }],
  });
}

export async function createConsumer(kafka: Kafka, groupId: string): Promise<Consumer> {
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  return consumer;
}
