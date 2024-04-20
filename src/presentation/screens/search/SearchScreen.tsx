import { useMemo, useState } from "react";
import { View, FlatList } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ActivityIndicator, TextInput } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { globalTheme } from "../../../config/theme/global-theme"
import { Pokemon } from "../../../domain/entities/pokemon";
import { PokemonCard } from "../../components/pokemons/PokemonCard";
import { getPokemonsByIds, getPokemonsNamesWitdId } from "../../../actions";
import { FulLScreenLoader } from "../../components/ui/FullScreenLoader";
import { useDebounceValue } from "../../hooks/useDebounceValue";

export const SearchScreen = () => {
    const { top } = useSafeAreaInsets();
    const [term, setTerm] = useState('');

    const debouncedValue = useDebounceValue(term);

    const { isLoading, data: pokemonNameList = [] } = useQuery({
        queryKey: ['pokemons', 'all'],
        queryFn: () => getPokemonsNamesWitdId()
    });

    const pokemonNameIdList = useMemo(() => {
        // Es un numero
        if (!isNaN(Number(debouncedValue))) {
            const pokemon = pokemonNameList.find(pokemon => pokemon.id === Number(debouncedValue));

            return pokemon ? [pokemon] : [];
        }

        if (debouncedValue.length === 0) return [];

        if (debouncedValue.length < 3) return [];

        return pokemonNameList.filter(pokemon => pokemon.name.includes(debouncedValue.toLocaleLowerCase()));
    }, [debouncedValue]);

    const { isLoading: isLoadingPokemons, data: pokemons = [] } = useQuery({
        queryKey: ['pokemons', 'by', , pokemonNameIdList],
        queryFn: () => getPokemonsByIds(pokemonNameIdList.map(pokemon => pokemon.id)),
        staleTime: 1000 * 60 * 5
    });

    if (isLoading) {
        return (<FulLScreenLoader />);
    }

    return (
        <View style={[globalTheme.globalMargin, { paddingTop: top + 10 }]}>
            <TextInput
                placeholder="Buscar pokemon"
                mode="flat"
                autoFocus
                autoCorrect={false}
                onChangeText={setTerm}
                value={term}
            />

            {
                isLoadingPokemons && (
                    <ActivityIndicator style={{ paddingTop: 20 }} />
                )
            }

            <FlatList
                data={pokemons}
                keyExtractor={(pokemon: Pokemon) => `${pokemon.id}`}
                numColumns={2}
                style={{ paddingTop: top + 30 }}
                renderItem={({ item }) => <PokemonCard pokemon={item} />}
                onEndReachedThreshold={0.6}
                showsHorizontalScrollIndicator={false}
                ListFooterComponent={<View style={{ height: 110 }} />}
            />
        </View>
    )
}
