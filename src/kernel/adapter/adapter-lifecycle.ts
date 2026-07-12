import {
  InvalidAdapterDefinitionError,
  InvalidAdapterLifecycleTransitionError,
} from './adapter.errors';

export const adapterLifecycleStates = [
  'Registered',
  'Available',
  'Active',
  'Completed',
  'Unavailable',
] as const;

export type AdapterLifecycleState = (typeof adapterLifecycleStates)[number];

const allowedTransitions: {
  readonly [State in AdapterLifecycleState]: readonly AdapterLifecycleState[];
} = {
  Registered: ['Available'],
  Available: ['Active'],
  Active: ['Completed'],
  Completed: ['Unavailable'],
  Unavailable: [],
};

export class AdapterLifecycle {
  private constructor(private readonly stateValue: AdapterLifecycleState) {
    Object.freeze(this);
  }

  public static registered(): AdapterLifecycle {
    return new AdapterLifecycle('Registered');
  }

  public static fromState(state: AdapterLifecycleState | string): AdapterLifecycle {
    const normalized = state.trim();

    if (!isAdapterLifecycleState(normalized)) {
      throw new InvalidAdapterDefinitionError(`Adapter lifecycle state '${normalized}' is not valid.`);
    }

    return new AdapterLifecycle(normalized);
  }

  public get state(): AdapterLifecycleState {
    return this.stateValue;
  }

  public canTransitionTo(nextState: AdapterLifecycleState | string): boolean {
    const normalizedNextState = AdapterLifecycle.fromState(nextState).state;

    return allowedTransitions[this.stateValue].some((allowedState) => allowedState === normalizedNextState);
  }

  public transitionTo(nextState: AdapterLifecycleState | string): AdapterLifecycle {
    const normalizedNextState = AdapterLifecycle.fromState(nextState).state;

    if (!this.canTransitionTo(normalizedNextState)) {
      throw new InvalidAdapterLifecycleTransitionError(this.stateValue, normalizedNextState);
    }

    return new AdapterLifecycle(normalizedNextState);
  }

  public equals(other: AdapterLifecycle): boolean {
    return this.stateValue === other.state;
  }

  public toString(): AdapterLifecycleState {
    return this.stateValue;
  }

  public toJSON(): AdapterLifecycleState {
    return this.stateValue;
  }
}

function isAdapterLifecycleState(value: string): value is AdapterLifecycleState {
  return adapterLifecycleStates.some((state) => state === value);
}
