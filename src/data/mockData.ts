// Mock chat threads data
export const mockChatThreads = [
  {
    id: "thread_1",
    title: "React Performance Optimization",
    createdAt: new Date("2025-06-10T14:30:00Z"),
    updatedAt: new Date("2025-06-13T16:45:00Z"),
    messages: [
      {
        id: "msg_1",
        role: "user" as const,
        content: "How can I optimize my React app's performance?",
        createdAt: new Date("2025-06-10T14:30:00Z"),
      },
      {
        id: "msg_2",
        role: "assistant" as const,
        content: "Here are some key React performance optimization strategies:\n\n1. **Use React.memo()** for component memoization\n2. **Implement useMemo()** for expensive calculations\n3. **Use useCallback()** for function references\n4. **Code splitting** with React.lazy()\n5. **Optimize bundle size** with tree shaking",
        createdAt: new Date("2025-06-10T14:31:15Z"),
      },
      {
        id: "msg_3",
        role: "user" as const,
        content: "Can you show me an example of React.memo()?",
        createdAt: new Date("2025-06-13T16:45:00Z"),
      },
    ],
  },
  {
    id: "thread_2",
    title: "Database Schema Design",
    createdAt: new Date("2025-06-12T09:15:00Z"),
    updatedAt: new Date("2025-06-12T11:22:00Z"),
    messages: [
      {
        id: "msg_4",
        role: "user" as const,
        content: "I'm designing a database for a school management system. What tables should I consider?",
        createdAt: new Date("2025-06-12T09:15:00Z"),
      },
      {
        id: "msg_5",
        role: "assistant" as const,
        content: "For a school management system, consider these core tables:\n\n**Students**\n- student_id, first_name, last_name, email, enrollment_date\n\n**Teachers**\n- teacher_id, first_name, last_name, email, department\n\n**Courses**\n- course_id, course_name, course_code, credits, department\n\n**Enrollments**\n- enrollment_id, student_id, course_id, semester, grade\n\n**Classes**\n- class_id, course_id, teacher_id, schedule, room",
        createdAt: new Date("2025-06-12T09:18:30Z"),
      },
      {
        id: "msg_6",
        role: "user" as const,
        content: "What about relationships between these tables?",
        createdAt: new Date("2025-06-12T11:22:00Z"),
      },
    ],
  },
  {
    id: "thread_3",
    title: "JavaScript Array Methods",
    createdAt: new Date("2025-06-11T13:45:00Z"),
    updatedAt: new Date("2025-06-11T13:52:00Z"),
    messages: [
      {
        id: "msg_7",
        role: "user" as const,
        content: "What's the difference between map, filter, and reduce?",
        createdAt: new Date("2025-06-11T13:45:00Z"),
      },
      {
        id: "msg_8",
        role: "assistant" as const,
        content: "Great question! Here's how they differ:\n\n**map()** - Transforms each element, returns new array of same length\n```javascript\n[1,2,3].map(x => x * 2) // [2,4,6]\n```\n\n**filter()** - Keeps elements that pass a test, returns new array\n```javascript\n[1,2,3,4].filter(x => x > 2) // [3,4]\n```\n\n**reduce()** - Combines all elements into single value\n```javascript\n[1,2,3].reduce((sum, x) => sum + x, 0) // 6\n```",
        createdAt: new Date("2025-06-11T13:47:20Z"),
      },
      {
        id: "msg_9",
        role: "user" as const,
        content: "Perfect! That's exactly what I needed for my lesson plan.",
        createdAt: new Date("2025-06-11T13:52:00Z"),
      },
    ],
  },
];

// Type definitions to match Vercel AI SDK
export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
}

export interface ChatThread {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}
