import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { Dashboard } from '../../screens/Dashboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((callback) => callback()),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn()
  })
}));

describe('Home', () => {
  it('should be able to get data on async storage', async () => {
    const spyGetItem = jest.spyOn(AsyncStorage, 'getItem')
      .mockReturnValueOnce(
        Promise.resolve(
          JSON.stringify([
            {
              id: '0',
              service_name: 'Rocketseat',
              email: 'johndoe@example.com',
              password: '123456'
            },
            {
              id: '1',
              service_name: 'LinkedIn',
              email: 'johndoe@example2.com',
              password: '123456'
            }
          ])
        )
      )

    const { findByText, getByText } = render(
      <Dashboard />
    );

    expect(await findByText('johndoe@example.com')).toBeTruthy()
    expect(getByText('johndoe@example2.com')).toBeTruthy()

    expect(spyGetItem).toHaveBeenCalledWith('@savepass:logins');
  });

  it('should be able to filter pass data with search bar', async () => {
    const spyGetItem = jest.spyOn(AsyncStorage, 'getItem')
      .mockReturnValueOnce(
        Promise.resolve(
          JSON.stringify([
            {
              id: '0',
              service_name: 'Rocketseat',
              email: 'rocketseat@mail.com',
              password: '123456'
            },
            {
              id: '1',
              service_name: 'LinkedIn',
              email: 'linkedin@mail.com',
              password: '123456'
            }
          ])
        )
      )

    const {
      getByPlaceholderText,
      getByTestId,
      findByText,
      queryByText,
    } = render(
      <Dashboard />
    );

    // Ensures first render is complete (act)
    await findByText('linkedin@mail.com');

    const textInput = getByPlaceholderText("Qual senha você procura?");
    const submitButton = getByTestId("search-button");

    fireEvent.changeText(textInput, 'LinkedIn');
    fireEvent.press(submitButton);

    expect(queryByText('rocketseat@mail.com')).toBeNull();
    expect(queryByText('linkedin@mail.com')).toBeTruthy();
    expect(spyGetItem).toHaveBeenCalledWith('@savepass:logins');
  });
})