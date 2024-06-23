import { setPosition, setCollision } from '../../redux/actions';
import { expect } from '@jest/globals';

describe('Actions', () => {
  it('should create an action to set position', () => {
    const expectedAction = {
      type: 'SET_POSITION',
      payload: { x: 10, y: 20 }
    };
    expect(setPosition({ x: 10, y: 20 })).toEqual(expectedAction);
  });

  it('should create an action to set collision', () => {
    const expectedAction = {
      type: 'SET_COLLISION',
      payload: true
    };
    expect(setCollision(true)).toEqual(expectedAction);
  });
});
