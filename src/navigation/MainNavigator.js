import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {navigate, navigationRef} from './rootNavigator';
import {routes} from './Routes';
import Splash from '../screens/Splash';
import OnBoarding from '../screens/OnBoarding';
import Login from '../screens/Auth/Login';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import SignUp from '../screens/Auth/SignUp';
import {TabBar} from '../common/TabBar';
import Home from '../screens/BottomTabScreen/Home';
import MarketPlace from '../screens/BottomTabScreen/MarketPlace';
import NewListing from '../screens/BottomTabScreen/MarketPlace/NewListing';
import Category from '../screens/BottomTabScreen/MarketPlace/Category';
import MarketplaceAccount from '../screens/BottomTabScreen/MarketPlace/MarketplaceAccount';
// import MarketplaceProfile from '../screens/BottomTabScreen/MarketPlace/MarketplaceProfile';
import ProductDetails from '../screens/BottomTabScreen/MarketPlace/ProductDetails';
import EditLocation from '../screens/BottomTabScreen/EditLocation';
import Profile from '../screens/Profile';
// import ItemBuy from '../screens/BottomTabScreen/MarketPlace/MarketplaceAccount/ItemBuy';
import YourListings from '../screens/BottomTabScreen/MarketPlace/MarketplaceAccount/YourListings';
import FollowersList from '../screens/BottomTabScreen/MarketPlace/FollowersList';
import FollowingList from '../screens/BottomTabScreen/MarketPlace/FollowingList';
import SocialTab from '../screens/SocialTab';
import CreatePost from '../screens/SocialTab/CreatePost';
import UserProfile from '../screens/UserProfile';
import OtherUserProfile from '../screens/OtherUserProfile';
import ProfileFollowerList from '../screens/SocialAllFollowerFollowingList';
import AllFollowingList from '../screens/SocialFollowingList';
import ChangeLocation from '../screens/BottomTabScreen/MarketPlace/ChangeLocation';
import BlogScreen from '../screens/BlogScreen';
import PostRequest from '../screens/PostRequest';
import PostRequestEditLocation from '../screens/PostRequest/PostRequestEditLocation';
import RequestsScreen from '../screens/RequestsScreen';
import MyRequestDetails from '../screens/RequestsScreen/MyRequestDetails';
import NewRequestDetails from '../screens/RequestsScreen/NewRequestDetails';
import ProposalAcceptedScreen from '../screens/RequestsScreen/ProposalAcceptedScreen';
import RequestStatusScreen from '../screens/RequestsScreen/RequestStatusScreen';
import AcceptedRequestDetails from '../screens/RequestsScreen/AcceptedRequestDetails';
import ChatScreen from '../screens/chat/ChatScreen';
import InboxScreen from '../screens/chat/InboxScreen';
import MessageScreen from '../screens/chat/MessageScreen';
// import UnreadScreen from '../screens/chat/UnreadScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import AboutScreen from '../screens/Profile/AboutScreen';
import HelpScreen from '../screens/Profile/HelpScreen';
import SettingScreen from '../screens/Profile/SettingScreen';
import BlogDetailScreen from '../screens/BlogScreen/BlogDetailScreen';
import DeclineDetailScreen from '../screens/RequestsScreen/DeclineDetailScreen';
import SuggestionScreen from '../screens/SuggestionScreen';
import TrainingScreen from '../screens/TrainingScreen';
import BusinessPartnerScreen from '../screens/BusinessPartnerScreen';
import GovHelp from '../screens/GovHelp';
import HelpListScreen from '../screens/Profile/HelpListScreen';

import ChangePasswordScreen from '../screens/Profile/ChangePasswordScreen';
import DeleteAccountScreen from '../screens/Profile/DeleteAccountScreen';
import CompletedRequestScreen from '../screens/RequestsScreen/CompletedRequestScreen';
import NotificationListScreen from '../screens/NotificationListScreen';
import UniversalSearchScreen from '../screens/UniversalSearchScreen';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={routes.Splash}
        screenOptions={{headerShown: false, gestureEnabled: false}}>
        <Stack.Screen name={routes.Splash} component={Splash} />
        <Stack.Screen name={routes.OnBoarding} component={OnBoarding} />
        <Stack.Screen name={routes.Login} component={Login} />
        <Stack.Screen name={routes.ForgotPassword} component={ForgotPassword} />
        <Stack.Screen name={routes.SignUp} component={SignUp} />
        <Stack.Screen name={routes.TabNavigator} component={TabNavigator} />
        <Stack.Screen name={routes.NewListing} component={NewListing} />
        <Stack.Screen name={routes.Category} component={Category} />
        <Stack.Screen
          name={routes.MarketplaceAccount}
          component={MarketplaceAccount}
        />
        {/* //<Stack.Screen
          name={routes.MarketplaceProfile}rr
          component={MarketplaceProfile}
        />// */}
        <Stack.Screen name={routes.ProductDetails} component={ProductDetails} />
        <Stack.Screen name={routes.EditLocation} component={EditLocation} />
        {/* <Stack.Screen name={routes.ItemBuy} component={ItemBuy} /> */}
        <Stack.Screen name={routes.YourListings} component={YourListings} />
        <Stack.Screen name={routes.FollowersList} component={FollowersList} />
        <Stack.Screen name={routes.FollowingList} component={FollowingList} />
        <Stack.Screen name={routes.CreatePost} component={CreatePost} />
        <Stack.Screen name={routes.UserProfile} component={UserProfile} />
        <Stack.Screen
          name={routes.OtherUserProfile}
          component={OtherUserProfile}
        />
        <Stack.Screen
          name={routes.ProfileFollowerList}
          component={ProfileFollowerList}
        />
        <Stack.Screen
          name={routes.AllFollowingList}
          component={AllFollowingList}
        />
        <Stack.Screen name={routes.ChangeLocation} component={ChangeLocation} />
        <Stack.Screen name={routes.PostRequest} component={PostRequest} />
        <Stack.Screen
          name={routes.PostRequestEditLocation}
          component={PostRequestEditLocation}
        />
        <Stack.Screen name={routes.RequestsScreen} component={RequestsScreen} />
        <Stack.Screen
          name={routes.MyRequestDetails}
          component={MyRequestDetails}
        />
        <Stack.Screen
          name={routes.NewRequestDetails}
          component={NewRequestDetails}
        />
        <Stack.Screen
          name={routes.ProposalAcceptedScreen}
          component={ProposalAcceptedScreen}
        />
        <Stack.Screen name={routes.ChatScreen} component={ChatScreen} />
        <Stack.Screen name={routes.InboxScreen} component={InboxScreen} />
       <Stack.Screen name={routes.MessageScreen} component={MessageScreen} />
        <Stack.Screen
          name={routes.EditProfileScreen}
          component={EditProfileScreen}
        />
        <Stack.Screen name={routes.AboutScreen} component={AboutScreen} />
        <Stack.Screen name={routes.HelpScreen} component={HelpScreen} />
        <Stack.Screen name={routes.SettingScreen} component={SettingScreen} />
        <Stack.Screen
          name={routes.BlogDetailScreen}
          component={BlogDetailScreen}
        />
        <Stack.Screen
          name={routes.RequestStatusScreen}
          component={RequestStatusScreen}
        />
        <Stack.Screen
          name={routes.AcceptedRequestDetails}
          component={AcceptedRequestDetails}
        />
        <Stack.Screen
          name={routes.CompletedRequestScreen}
          component={CompletedRequestScreen}
        />
        <Stack.Screen
          name={routes.DeclineDetailScreen}
          component={DeclineDetailScreen}
        />
        <Stack.Screen
          name={routes.SuggestionScreen}
          component={SuggestionScreen}
        />
        <Stack.Screen name={routes.TrainingScreen} component={TrainingScreen} />
        <Stack.Screen
          name={routes.BusinessPartnerScreen}
          component={BusinessPartnerScreen}
        />
        <Stack.Screen name={routes.GovHelp} component={GovHelp} />
        <Stack.Screen name={routes.HelpListScreen} component={HelpListScreen} />

        <Stack.Screen
          name={routes.ChangePasswordScreen}
          component={ChangePasswordScreen}
        />
        <Stack.Screen
          name={routes.DeleteAccountScreen}
          component={DeleteAccountScreen}
        />
        <Stack.Screen
          name={routes.NotificationListScreen}
          component={NotificationListScreen}
        />
        <Stack.Screen
          name={routes.UniversalSearch}
          component={UniversalSearchScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false,
        //headerShown: false,
        tabBarShowLabel: false, // Hides labels for a minimalist design
        tabBarActiveTintColor: '#6200EE', // Active icon color
        tabBarInactiveTintColor: '#808080', // Inactive icon color
        tabBarStyle: {
      position: 'absolute',
      backgroundColor: '#754595',   // Purple bar
      height: 62,
      marginHorizontal: 10,
      marginBottom: 5,
      borderRadius: 40,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      elevation: 10,
      borderTopWidth: 0,
    },
    tabBarItemStyle: {
      backgroundColor: 'transparent',
    },
      }}
      
      tabBar={props => (
        <TabBar
          {...props}
          onPressPlus={() => {            
            const currentRoute = props.state.routes[props.state.index].name;
            if (currentRoute === routes.tab1) {
              navigate(routes.PostRequest);
            } else if (currentRoute === routes.SocialTab) {
              navigate(routes.CreatePost);
            } else if (currentRoute === routes.MarketPlace) {
              navigate(routes.NewListing);
            }
          }}
        />
      )}>
      <Tab.Screen name={routes.tab1} component={Home} />
      <Tab.Screen name={routes.SocialTab} component={SocialTab} />
      <Tab.Screen name={routes.MarketPlace} component={MarketPlace} />
      <Tab.Screen name={routes.BlogScreen} component={BlogScreen} />
      <Tab.Screen name={routes.HelpScreen} component={HelpScreen} />
      <Tab.Screen name={routes.Profile} component={Profile} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
