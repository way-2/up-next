import React from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import LicensesListItem from './licenseListItem';

export default function Licenses({ licenses }) {
  const renderItem = React.useCallback(
    ({ item }) => <LicensesListItem {...item} />,
    []
  );

  return (
    <FlatList
      style={styles.list}
      keyExtractor={({ key }) => key}
      data={licenses}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});