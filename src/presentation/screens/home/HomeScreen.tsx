import { useQuery } from "@tanstack/react-query"
import { View } from "react-native"
import { ActivityIndicator, Button, Text } from "react-native-paper"
import { getPokemons } from "../../../actions";

export const HomeScreen = () => {

    const { isLoading, data = [] } = useQuery({
        queryKey: ['pokemons'],
        queryFn: () => getPokemons(0),
        staleTime: 1000 * 60 * 60
    });

    return (
        <View>
            <Text variant="displaySmall">HomeScreen</Text>

            {
                isLoading
                    ? <ActivityIndicator />
                    : (
                        <Button
                            icon="camera"
                            mode="contained"
                            onPress={() => console.log('Pressed')}
                        >
                            Press me
                        </Button>
                    )
            }
        </View>
    )
}
