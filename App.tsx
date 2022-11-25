import { StatusBar } from 'expo-status-bar';
import { FC } from 'react';
import { StyleSheet, Dimensions, SafeAreaView, Pressable, Text, Image, View } from 'react-native';
import Animated, {SharedValue, useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated'


interface  CircleProps {
  index: number,
  color: string,
  position: SharedValue<number>
  rollButton?: () => void
  isLead?: boolean
  rotation?: SharedValue<number>
}

const images = [
    require("./assets/share.png"),
    require("./assets/mail.png"),
    require("./assets/speaker.png"),
    require("./assets/navigate.png"),
    require("./assets/radio.png"),
]

const colors = [
    '#DB504A',
    "#FF6F59",
    "#254441",
    "#43AA8B",
    "#B2B09B",
    "#BAB25B"
]

const { width } = Dimensions.get('window')
const dotOffset = width / 6;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const Circle: FC<CircleProps> = ({ color, isLead, index , position, rollButton, rotation}) => {

    const defaultSharedValue = useSharedValue(dotOffset * index + 3)
    const calculatePosition = useSharedValue(0)

    const style = useAnimatedStyle(() => {
        'worklet';
        calculatePosition.value = withSpring(position.value, {
            stiffness: 50,
            mass: 0.7
        })

        const scaleValue = calculatePosition.value - 3 > defaultSharedValue.value ? 1 : 0
        const restDisplacementNumber = calculatePosition.value - 3 > defaultSharedValue.value ? 1 : 20

        if(isLead && calculatePosition.value <= 10) {
            rotation!.value = 0
        } else {
            rotation!.value = Math.PI * (calculatePosition.value / width) * 1.5
        }

        return {
            position: "absolute",
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: color,
            zIndex: isLead ? 10 : 1,
            justifyContent: 'center',
            alignItems: 'center',
            left: isLead ? undefined : defaultSharedValue.value,
            transform: [
                {
                    scale: isLead ? 1 : withSpring(scaleValue, {
                        mass: 0.5,
                        restDisplacementThreshold: restDisplacementNumber
                    })
                },
                {
                    translateX: isLead
                        ? withSpring(position.value, {
                            stiffness: 50,
                            mass: 0.7
                        })
                        : 1,
                },
                {
                    rotate: isLead ? withSpring(`${rotation?.value}rad`) : `${0}rad`
                }
            ]
        }
    })
    return <AnimatedPressable style={style} onPress={() => {
        isLead || calculatePosition.value >= 10 ? rollButton?.() : undefined
    }}>
        <View style={styles.buttonContent}>
            {isLead ? (
                <Text style={styles.plusButton}>+</Text>
            ) : (
                <Image
                    source={images[index]}
                    style={styles.buttonImage}
                    resizeMode='contain'
                />
            )}
        </View>
    </AnimatedPressable>
}


export default function App() {

    const position = useSharedValue(6)
    const rotation = useSharedValue(Math.PI)

    const rollButton = () => {
        'worklet';
     if(position.value === dotOffset * 5 + 3) {
         position.value = 6
     } else {
         position.value = dotOffset * 5 + 3;
     }
    }

    const showMessage = (message: string) => {
     'worklet';
     alert(message)
    }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.container}/>
        <View style={styles.menuContainer}>
            <Circle index={0} color={colors[0]} position={position} rotation={rotation} rollButton={() => showMessage('ok')}/>
            <Circle index={1} color={colors[1]} position={position} rotation={rotation} rollButton={() => showMessage('ok')}/>
            <Circle index={2} color={colors[2]} position={position} rotation={rotation} rollButton={() => showMessage('ok')}/>
            <Circle index={3} color={colors[3]} position={position} rotation={rotation} rollButton={() => showMessage('ok')}/>
            <Circle index={4} color={colors[4]} position={position} rotation={rotation} rollButton={() => showMessage('ok')}/>
            <Circle index={5} color={colors[5]} position={position} rotation={rotation} rollButton={rollButton} isLead={true}/>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
    menuContainer: {
      height: 100,
      backgroundColor: 'black',
      justifyContent: 'center'
    },
    buttonContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    plusButton: {
      fontSize: 35,
      fontWeight: 'bold',
      marginTop: -3
    },
    buttonImage: {
      height: 20,
      width: 20,
    }
});
