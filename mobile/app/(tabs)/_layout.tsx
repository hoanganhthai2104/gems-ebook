/**
 * Bottom tab shell - the native replacement for #app-bottom-nav.
 * The active tab shows a filled icon inside a soft blue circle, matching
 * the web nav's active-tab-circle treatment.
 */
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, radius, shadow } from '@/theme/tokens';

type IconName = keyof typeof MaterialIcons.glyphMap;

function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
      <MaterialIcons name={name} size={focused ? 23 : 21} color={focused ? colors.primary : colors.slate500} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.slate500,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Thư viện',
          tabBarIcon: ({ focused }) => <TabIcon name="menu-book" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: 'Tin tức',
          tabBarIcon: ({ focused }) => <TabIcon name="article" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ focused }) => <TabIcon name="person" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.slate200,
    height: 68,
    paddingTop: 6,
    paddingBottom: 8,
    ...shadow.navBar,
  },
  tabItem: { paddingVertical: 0 },
  tabLabel: { fontSize: fontSize.xs, fontWeight: '700', marginTop: 0 },
  iconWrapper: {
    width: 42,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: { backgroundColor: colors.primarySoft },
});
