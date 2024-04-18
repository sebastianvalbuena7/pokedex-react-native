import { FlatList, StyleSheet, View } from "react-native"
import { ActivityIndicator, Button, Text } from "react-native-paper"
import { useQuery } from "@tanstack/react-query"
import { PokeballBg } from "../../components/ui/PokeballBg";
import { getPokemons } from "../../../actions";
import { Pokemon } from "../../../domain/entities/pokemon";
import { globalTheme } from "../../../config/theme/global-theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PokemonCard } from "../../components/pokemons/PokemonCard";

export const HomeScreen = () => {
    const { top } = useSafeAreaInsets();

    const { isLoading, data: pokemons = [] } = useQuery({
        queryKey: ['pokemons'],
        queryFn: () => getPokemons(0),
        staleTime: 1000 * 60 * 60
    });

    return (
        <View style={globalTheme.globalMargin}>
            <PokeballBg style={styles.imgPosition} />

            <FlatList
                data={pokemons}
                keyExtractor={(pokemon: Pokemon) => `${pokemon.id}`}
                numColumns={2}
                ListHeaderComponent={() => (
                    <Text variant="displayMedium">Pokedex</Text>
                )}
                style={{
                    paddingTop: top + 20
                }}
                renderItem={({ item }) => <PokemonCard pokemon={item} />}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    imgPosition: {
        position: 'absolute',
        top: -100,
        right: -100
    }
})