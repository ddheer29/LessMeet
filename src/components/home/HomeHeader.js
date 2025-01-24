import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useUserStore} from '../../service/userStore';
import InquiryModal from './InquiryModal';
import {headerStyles} from '../../styles/headerStyles';
import {CircleUser, Menu} from 'lucide-react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Colors} from '../../utils/Constants';
import {navigate} from '../../utils/NavigationUtils';

const HomeHeader = () => {
  const [visible, setVisible] = useState(false);
  const {user} = useUserStore();

  const handleNavigation = () => {
    const storedName = user?.name;
    if (!storedName) {
      setVisible(true);
      return;
    }
    navigate('JoinMeetScreen');
  };

  useEffect(() => {
    const checkUserName = () => {
      const storedName = user?.name;
      if (!storedName) {
        setVisible(true);
      }
    };
    checkUserName();
  }, []);

  return (
    <>
      <SafeAreaView />
      <View style={headerStyles.container}>
        <Menu name="menu" size={RFValue(20)} color={Colors.text} />
        <TouchableOpacity
          style={headerStyles.textContainer}
          onPress={handleNavigation}>
          <Text style={headerStyles.placeholderText}>Enter a meeting code</Text>
        </TouchableOpacity>
        <CircleUser
          name="menu"
          onPress={() => setVisible(true)}
          size={RFValue(20)}
          color={Colors.primary}
        />
      </View>
      <InquiryModal visible={visible} onClose={() => setVisible(false)} />
    </>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({});
