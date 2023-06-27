import {
  LayoutChangeEvent,
  Pressable,
  Text,
  ViewProps,
  View,
} from 'react-native';
import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useRef,
} from 'react';
import Reanimated, {
  interpolate,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const TabContext = createContext({} as { currentTab: number });

type EventType = { width: number; x: number };

const TabIndicator = ({
  itemsMeasure,
  index,
}: {
  itemsMeasure: EventType[];
  index: number;
}) => {
  const indicatorTransitionStyle = useAnimatedStyle(() => {
    'worklet';
    const width = interpolate(
      index,
      itemsMeasure.map((_v, i) => i),
      itemsMeasure.map((v) => v.width)
    );
    const left = interpolate(
      index,
      itemsMeasure.map((_v, i) => i),
      itemsMeasure.map((i) => i.x)
    );
    return {
      width,
      left: withTiming(left),
    };
  });

  return (
    <Reanimated.View
      style={[
        {
          top: 2,
          zIndex: -1,
          left: 2,
          backgroundColor: 'white',
          position: 'absolute',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: 'black',
          height: '100%',
        },
        indicatorTransitionStyle,
      ]}
    />
  );
};

const TabItem = ({
  label,
  index,
  onPress,
  onItemLayout,
}: {
  label: string;
  index: number;
  onPress(): void;
  onItemLayout(event: LayoutChangeEvent, index: number): void;
}) => {
  const itemRef = useRef<any>();

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (itemRef?.current) {
        onItemLayout(event, index);
      }
    },
    [index, onItemLayout]
  );

  return (
    <Pressable
      ref={itemRef}
      style={{ flex: 1, paddingVertical: 4 }}
      onPress={onPress}
      onLayout={onLayout}
    >
      <Text style={{ fontWeight: '600', textAlign: 'center' }}>{label}</Text>
    </Pressable>
  );
};

export const TabPage = ({
  children,
  index,
  ...rest
}: PropsWithChildren<{ index: number } & ViewProps>) => {
  const { currentTab } = useContext(TabContext);

  if (index !== currentTab) {
    return null;
  }
  return <View {...rest}>{children}</View>;
};

export const TabWrapper = ({
  items,
  children,
}: PropsWithChildren<{ items: Record<'label', string>[] }>) => {
  const [currentTab, setCurrentTab] = React.useState<number>(0);
  const [measure, setMeasure] = React.useState<EventType[]>([]);

  const onItemLayout = useCallback(
    (event: LayoutChangeEvent, _index: number) => {
      const { width, x } = event.nativeEvent.layout;
      setMeasure((prev) => [...prev, { width, x }].sort((a, b) => a.x - b.x));
    },
    []
  );

  return (
    <TabContext.Provider value={{ currentTab }}>
      {/* TAB ITEMS */}
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 16,
          justifyContent: 'space-between',
          borderRadius: 8,
          padding: 2,
          backgroundColor: '#DEDEDE',
        }}
      >
        {items.map((item, index) => (
          <TabItem
            label={item.label}
            onItemLayout={onItemLayout}
            onPress={() => setCurrentTab(index)}
            index={index}
            key={index}
          />
        ))}
        {measure.length === items.length && (
          <TabIndicator itemsMeasure={measure} index={currentTab} />
        )}
      </View>
      {children}
    </TabContext.Provider>
  );
};
