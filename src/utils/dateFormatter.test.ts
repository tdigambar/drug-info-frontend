import { formatLaunchDate } from './dateFormatter';

describe('formatLaunchDate', () => {
  it('should format a valid ISO date string to dd.mm.yyyy format', () => {
    const dateString = '2004-02-14T13:01:10Z';
    const result = formatLaunchDate(dateString);
    expect(result).toBe('14.02.2004');
  });

  it('should pad single digit days with leading zero', () => {
    const dateString = '2004-02-01T00:00:00Z';
    const result = formatLaunchDate(dateString);
    expect(result).toBe('01.02.2004');
  });

  it('should pad single digit months with leading zero', () => {
    const dateString = '2004-01-14T00:00:00Z';
    const result = formatLaunchDate(dateString);
    expect(result).toBe('14.01.2004');
  });

  it('should format dates with both single digit day and month', () => {
    const dateString = '2004-01-01T00:00:00Z';
    const result = formatLaunchDate(dateString);
    expect(result).toBe('01.01.2004');
  });

  it('should format dates with double digit day and month', () => {
    const dateString = '2004-12-31T00:00:00Z';
    const result = formatLaunchDate(dateString);
    expect(result).toBe('31.12.2004');
  });

  it('should handle dates from different centuries', () => {
    const dateString = '1899-03-06T00:00:00Z';
    const result = formatLaunchDate(dateString);
    expect(result).toBe('06.03.1899');
  });

  it('should handle future dates', () => {
    const dateString = '2099-12-31T00:00:00Z';
    const result = formatLaunchDate(dateString);
    expect(result).toBe('31.12.2099');
  });

  it('should handle ISO date strings without time', () => {
    const dateString = '2004-02-14';
    const result = formatLaunchDate(dateString);
    expect(result).toBe('14.02.2004');
  });

  it('should handle ISO date strings with timezone offset', () => {
    const dateString = '2004-02-14T10:30:00+05:00';
    const result = formatLaunchDate(dateString);
    expect(result).toBe('14.02.2004');
  });

  it('should handle dates with milliseconds', () => {
    const dateString = '2004-02-14T13:01:10.123Z';
    const result = formatLaunchDate(dateString);
    expect(result).toBe('14.02.2004');
  });

  it('should handle leap year dates correctly', () => {
    const dateString = '2004-02-29T00:00:00Z';
    const result = formatLaunchDate(dateString);
    expect(result).toBe('29.02.2004');
  });
});

