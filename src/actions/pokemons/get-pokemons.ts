import { pokeApi } from "../../config/api/pokeApi";
import { Pokemon } from "../../domain/entities/pokemon";
import type { PokeAPIPaginatedResponse, PokeAPIPokemon } from "../../infrastructure/interfaces/pokeapi.interfaces";
import { PokemonMapper } from "../../infrastructure/mappers/pokemon.mapper";

export const getPokemons = async (page: number, limit: number = 10): Promise<Pokemon[]> => {
    try {
        // /pokemon?offset=20&limit=10
        const url = `/pokemon?offset=${page * 10}&limit=${limit}`;
        const { data } = await pokeApi.get<PokeAPIPaginatedResponse>(url);

        const pokemonPromises = data.results.map((info) => {
            return pokeApi.get<PokeAPIPokemon>(info.url);
        });

        const pokeApiPokemons = await Promise.all(pokemonPromises);

        const pokemons = pokeApiPokemons.map((item) => PokemonMapper.pokeApiPokemonToEntity(item.data));

        return pokemons;
    } catch (error) {
        throw new Error('Ha ocurrido un error');
    }
}