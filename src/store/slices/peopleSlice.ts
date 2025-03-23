import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Person } from '../../types/models';

interface PeopleState {
  people: Person[];
  loading: boolean;
  error: string | null;
}

const initialState: PeopleState = {
  people: [],
  loading: false,
  error: null,
};

const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    setPeople: (state, action: PayloadAction<Person[]>) => {
      state.people = action.payload;
    },
    addPerson: (state, action: PayloadAction<Person>) => {
      state.people.push(action.payload);
    },
    updatePerson: (state, action: PayloadAction<Person>) => {
      const index = state.people.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.people[index] = action.payload;
      }
    },
    incrementMeetCount: (state, action: PayloadAction<string>) => {
      const person = state.people.find(p => p.id === action.payload);
      if (person) {
        person.meetCount += 1;
        person.lastMeetDate = new Date().toISOString();
        // タイトルの更新は要件に応じて実装
      }
    },
  },
});

export const { setPeople, addPerson, updatePerson, incrementMeetCount } = peopleSlice.actions;
export default peopleSlice.reducer;
