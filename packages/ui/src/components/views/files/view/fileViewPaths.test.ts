import { describe, expect, test } from 'bun:test';

import { getAncestorPaths, getDisplayPath, isPathWithinRoot } from './fileViewPaths';

describe('fileViewPaths root directories', () => {
  test('treats files under a Unix or drive root as inside it', () => {
    expect(isPathWithinRoot('/home/a.txt', '/')).toBe(true);
    expect(isPathWithinRoot('/', '/')).toBe(true);
    expect(isPathWithinRoot('C:/x/a.txt', 'C:/')).toBe(true);
    expect(isPathWithinRoot('c:/x/a.txt', 'C:/')).toBe(true);
  });

  test('keeps sibling and other-drive paths outside a root', () => {
    expect(isPathWithinRoot('/home/a.txt', '/home')).toBe(true);
    expect(isPathWithinRoot('/homex/a.txt', '/home')).toBe(false);
    expect(isPathWithinRoot('D:/x/a.txt', 'C:/')).toBe(false);
  });

  test('lists ancestor folders of a file under a root directory', () => {
    expect(getAncestorPaths('/home/a/b.txt', '/')).toEqual(['/home', '/home/a']);
    expect(getAncestorPaths('/a.txt', '/')).toEqual([]);
    expect(getAncestorPaths('C:/x/y/a.txt', 'C:/')).toEqual(['C:/x', 'C:/x/y']);
    expect(getAncestorPaths('/repo/src/a.ts', '/repo')).toEqual(['/repo/src']);
  });

  test('shows a path relative to a root directory', () => {
    expect(getDisplayPath('/', '/home/a.txt')).toBe('home/a.txt');
    expect(getDisplayPath('C:/', 'C:/x/a.txt')).toBe('x/a.txt');
    expect(getDisplayPath('/repo', '/repo/src/a.ts')).toBe('src/a.ts');
  });
});
