import { FlatList, StyleSheet, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackScreenProps } from "@react-navigation/stack";
import { FAB, Text, useTheme } from "react-native-paper"
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { RootStackParams } from "../../navigator/StackNavigator";
import { getPokemons } from "../../../actions";
import { globalTheme } from "../../../config/theme/global-theme";
import { Pokemon } from "../../../domain/entities/pokemon";
import { PokeballBg } from "../../components/ui/PokeballBg";
import { PokemonCard } from "../../components/pokemons/PokemonCard";

interface Props extends StackScreenProps<RootStackParams, 'HomeScreen'> { };

export const HomeScreen = ({ navigation }: Props) => {
    const { top } = useSafeAreaInsets();
    const queryClient = useQueryClient();
    const theme = useTheme();

    // ! Peticiones tipicas 
    // const { isLoading, data: pokemons = [] } = useQuery({
    //     queryKey: ['pokemons'],
    //     queryFn: () => getPokemons(0),
    //     staleTime: 1000 * 60 * 60
    // });

    const { isLoading, data, fetchNextPage } = useInfiniteQuery({
        queryKey: ['pokemons', 'infinite'],
        initialPageParam: 0,
        queryFn: async params => {
            const pokemons = await getPokemons(params.pageParam);
            pokemons.forEach(pokemon => {
                queryClient.setQueryData(['pokemon', pokemon.id], pokemon);
            });
            return pokemons;
        },
        // ! Peticion normal
        // queryFn: params => getPokemons(params.pageParam),
        getNextPageParam: (lastPage, pages) => pages.length,
        staleTime: 1000 * 60 * 60, // 60 minutos
    });

    return (
        <View style={globalTheme.globalMargin}>
            <PokeballBg style={styles.imgPosition} />

            <FlatList
                data={data?.pages.flat() ?? []}
                keyExtractor={(pokemon: Pokemon) => `${pokemon.id}`}
                numColumns={2}
                ListHeaderComponent={() => (
                    <Text variant="displayMedium" style={{ marginBottom: 33 }}>Pokedex</Text>
                )}
                style={{
                    paddingTop: top + 30
                }}
                renderItem={({ item }) => <PokemonCard pokemon={item} />}
                onEndReachedThreshold={0.6}
                onEndReached={() => fetchNextPage()}
                showsHorizontalScrollIndicator={false}
            />

            <FAB
                icon={'card-search-outline'}
                style={[globalTheme.fab, { backgroundColor: theme.colors.primary }]}
                mode="elevated"
                onPress={() => navigation.push('SearchScreen')}
                color={theme.dark ? 'black' : 'white'}
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