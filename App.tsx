import { NavigationContainer } from '@react-navigation/native';

import RootNavigator from './src/navigation/RootNavigator';
import { JourneyProvider } from './src/lib/journeyContext';

export default function App() {
  return (
    <JourneyProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </JourneyProvider>
  );
}
