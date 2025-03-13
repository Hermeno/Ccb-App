import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialIcons } from '@expo/vector-icons';

const Tab = createMaterialTopTabNavigator();

function TopTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Settings') {
            iconName = 'cog';
          }

          return <MaterialIcons name="arrow-right" size={24} color={color} />;
        },
        tabBarActiveTintColor: '#487d76',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: { backgroundColor: '#fff' },
      })}
    >
      <Tab.Screen name="home" component={HomeScreen} />
    </Tab.Navigator>
  );
}

export default TopTabNavigator;
