import coursesData from '../data/Courses.json';
import type { Course } from '../models/Course';

export type CourseErrorCode = 'invalidCredentials' | 'offlineNoCache' | 'dataNotFound';

const ERROR_MESSAGES: Record<CourseErrorCode, string> = {
  invalidCredentials: 'Invalid email or password',
  offlineNoCache: 'You are offline and no saved courses were found',
  dataNotFound: 'Could not load course data',
};

export class CourseError extends Error {
  readonly code: CourseErrorCode;

  constructor(code: CourseErrorCode) {
    super(ERROR_MESSAGES[code]);
    this.name = 'CourseError';
    this.code = code;
  }
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/// Simulates a network API: short delays + bundled JSON data.
/// No real backend is involved.
export class MockCourseAPI {
  private readonly latency = 800;

  /// Mocked login. Any email works, the password must be at least
  /// 6 characters — this gives us a simple way to demo the error state.
  async login(_email: string, password: string): Promise<void> {
    await sleep(1000);
    if (password.length < 6) {
      throw new CourseError('invalidCredentials');
    }
  }

  /// Loads the mock course list from the bundled Courses.json.
  async fetchCourses(): Promise<Course[]> {
    await sleep(this.latency);
    // Decode a fresh copy every call, like Swift's JSONDecoder does,
    // so later lesson toggles never mutate the bundled data.
    return JSON.parse(JSON.stringify(coursesData)) as Course[];
  }
}
