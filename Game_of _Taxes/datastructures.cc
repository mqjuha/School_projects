// Datastructures.cc
//
// Student name: Julia Harttunen
// Student email: julia.harttunen@tuni.fi
// Student number: 291740

#include "datastructures.hh"

#include <random>

#include <cmath>

std::minstd_rand rand_engine; // Reasonably quick pseudo-random generator

template <typename Type>
Type random_in_range(Type start, Type end)
{
    auto range = end-start;
    ++range;

    auto num = std::uniform_int_distribution<unsigned long int>(0, range-1)(rand_engine);

    return static_cast<Type>(start+num);
}

// Modify the code below to implement the functionality of the class.
// Also remove comments from the parameter names when you implement
// an operation (Commenting out parameter name prevents compiler from
// warning about unused parameters on operations you haven't yet implemented.)

Datastructures::Datastructures()
{
    // Write any initialization you need here
}

Datastructures::~Datastructures()
{
    // Write any cleanup you need here
}

unsigned int Datastructures::town_count()
{
    return towns.size();
}

void Datastructures::clear_all()
{
    towns_vec.clear();
    towns.clear();
    in_order = false;
    alphabetically = false;
}

bool Datastructures::add_town(TownID id, const Name &name, Coord coord, int tax)
{
    auto it = towns.find(id);

    if ( it == towns.end() ) {
        struct Town new_town = {id, name, coord, tax, {}, NO_TOWNID};
        towns.insert( {id, new_town} );
        towns_vec.push_back(id);
        in_order = false;
        alphabetically = false;
        return true;
    }
    return false;
}

Name Datastructures::get_town_name(TownID id)
{
    auto it = towns.find(id);

    if ( it != towns.end() ) {
        return it->second.name;
    }
    return NO_NAME;
}

Coord Datastructures::get_town_coordinates(TownID id)
{
    auto it = towns.find(id);

    if ( it != towns.end() ) {
        return it->second.coord;
    }
    return NO_COORD;
}

int Datastructures::get_town_tax(TownID id)
{
    auto it = towns.find(id);

    if ( it != towns.end() ) {
        return it->second.tax;
    }
    return NO_VALUE;
}

std::vector<TownID> Datastructures::all_towns()
{
    return towns_vec;
}

std::vector<TownID> Datastructures::find_towns(const Name &name)
{
    std::vector<std::string> all_ids_with_name;
    all_ids_with_name.reserve(towns.size());

    for ( auto const& it: towns ) {

        if ( it.second.name == name ) {
            all_ids_with_name.push_back(it.first);
        }
    }
    return all_ids_with_name;
}

bool Datastructures::change_town_name(TownID id, const Name &newname)
{
    auto it = towns.find(id);

    if ( it != towns.end() ) {
        it->second.name = newname;
        return true;
    }
    return false;
}

std::vector<TownID> Datastructures::towns_alphabetically()
{
    if ( alphabetically == false ) {
        std::vector<std::pair<std::string, std::string>> pair_vec;
        pair_vec.reserve(towns.size());

        // muodostetaan pari kaupungin id:stä ja etäisyydestä
        for ( const auto &it : towns ) {
            pair_vec.push_back( {it.first, it.second.name} );
        }
        std::sort(pair_vec.begin(), pair_vec.end(),
                  [] (const auto &x, const auto &y) {return x.second < y.second;});

        towns_vec.clear();
        towns_vec.reserve(pair_vec.size());

        // muodostetaan vektori, jossa on vain id:t järjestyksessä etäisyyden mukaan
        for ( const auto & [id, name] : pair_vec ) {
            towns_vec.push_back(id);
        }
        alphabetically = true;
    }
    return towns_vec;
}

std::vector<TownID> Datastructures::towns_distance_increasing()
{
    if ( in_order == false ) {
        order_vec = make_distance_vector();
        in_order = true;
    }
    return order_vec;
}

TownID Datastructures::min_distance()
{
    if ( towns.size() != 0 ) {
        if ( in_order == false ) {
            order_vec = make_distance_vector();
            in_order = true;
        }
        return order_vec.front();
    }
    return NO_TOWNID;
}

TownID Datastructures::max_distance()
{
    if ( towns.size() != 0 ) {
        if ( in_order == false ) {
            order_vec = make_distance_vector();
            in_order = true;
        }
        return order_vec.back();
    }
    return NO_TOWNID;
}

bool Datastructures::add_vassalship(TownID vassalid, TownID masterid)
{
    auto vassal_it = towns.find(vassalid);
    auto master_it = towns.find(masterid);

    if ( vassal_it != towns.end() && master_it != towns.end() ) {

        // Tarkastellaan, että vassalilla ei ole jo masteria ja
        // lisäksi oletan, että kaupungit eivät voi olla toistensa mastereita ja vassaleita.
        if ( vassal_it->second.masterid == NO_TOWNID && master_it->second.masterid != vassalid ) {
            vassal_it->second.masterid = masterid;
            master_it->second.vassalid.push_back(vassalid);
            return true;
        }
    }
    return false;
}

std::vector<TownID> Datastructures::get_town_vassals(TownID id)
{
    auto master_it = towns.find(id);

    if ( master_it != towns.end() ) {
        return master_it->second.vassalid;
    }
    std::vector<TownID> no_townid_vec = {NO_TOWNID};
    return no_townid_vec;
}

std::vector<TownID> Datastructures::taxer_path(TownID id)
{
    std::vector<TownID> masters;
    masters.reserve(towns.size());
    auto it = towns.find(id);

    if ( it != towns.end() ) {
        masters.push_back(id);

        while ( !(it->second.masterid == NO_TOWNID) ) {
            masters.push_back(it->second.masterid);
            it = towns.find(it->second.masterid);
        }
    }
    else {
        masters.push_back(NO_TOWNID);
    }
    return masters;
}

bool Datastructures::remove_town(TownID id)
{
    auto remove_it = towns.find(id);

    if ( remove_it != towns.end() ) {
        auto master_id = remove_it->second.masterid;
        auto master_it = towns.find(master_id);
        auto vassal_ids_vec = remove_it->second.vassalid;

        if ( !(master_id == NO_TOWNID) ) {

            // poistettavan masteriin lisätään poistettavan vassalit
            for ( auto &vassal_id : vassal_ids_vec ) {
                auto vassal_it = towns.find(vassal_id);
                vassal_it->second.masterid = NO_TOWNID;
                add_vassalship(vassal_id, master_id);
            }
            // poistetaan masterin vassaleista poistettava
            std::vector<TownID>::iterator position = std::find(master_it->second.vassalid.begin(), master_it->second.vassalid.end(), id);
            master_it->second.vassalid.erase(position);
        }
        else if ( master_id == NO_TOWNID && !vassal_ids_vec.empty() ){

            // poistettavan vassaleista poistetaan masteri
            for ( auto &vassal_id : vassal_ids_vec ) {
                auto vassal_it = towns.find(vassal_id);
                vassal_it->second.masterid = NO_TOWNID;
            }
        }
        std::vector<TownID>::iterator position = std::find(towns_vec.begin(), towns_vec.end(), id);
        towns_vec.erase(position);
        towns.erase(id);

        in_order = false;
        alphabetically = false;
        return true;
    }
    return false;
}

std::vector<TownID> Datastructures::towns_nearest(Coord coord)
{
    return make_distance_vector(coord);
}

std::vector<TownID> Datastructures::longest_vassal_path(TownID id)
{
    // tyhjennetään vanhat
    comparison_path.clear();
    longest_path.clear();
    comparison_path.reserve(towns.size());
    longest_path.reserve(towns.size());

    auto it = towns.find(id);

    if ( it != towns.end() ) {

        if ( !it->second.vassalid.empty() ) {
            find_longest_path(id);
        }
        else {
            longest_path.push_back(id);
        }
    }
    else {
        longest_path.push_back(NO_TOWNID);
    }
    return longest_path;
}

int Datastructures::total_net_tax(TownID id)
{
    auto it = towns.find(id);

    if ( it != towns.end() ) {

        if ( !it->second.vassalid.empty() ) {
            int tax = tax_calculator(id);

            if ( !(it->second.masterid == NO_TOWNID) ) {
                return ceil(tax * 0.9);
            }
            return tax;
        }
        else if ( !(it->second.masterid == NO_TOWNID) ) {
            return ceil(it->second.tax * 0.9);
        }
        else {
            return it->second.tax;
        }
    }
    return NO_VALUE;
}

int Datastructures::distance_calculator(Coord coord, Coord start_coord)
{
    int distance = floor( sqrt( pow(start_coord.x - coord.x, 2) + pow(start_coord.y - coord.y, 2) ) );
    return distance;
}

std::vector<TownID> Datastructures::make_distance_vector(Coord start_coord)
{
    std::vector<std::pair<std::string, int>> pair_vector;
    pair_vector.reserve(towns.size());

    // muodostetaan pari kaupungin id:stä ja etäisyydestä
    for ( const auto &it : towns ) {
        int distance = distance_calculator(it.second.coord, start_coord);
        pair_vector.push_back( {it.first, distance} );
    }
    std::sort(pair_vector.begin(), pair_vector.end(),
              [] (const auto &x, const auto &y) {return x.second < y.second;});

    std::vector<std::string> all_ids;
    all_ids.reserve(pair_vector.size());

    // muodostetaan vektori, jossa on vain id:t järjestyksessä etäisyyden mukaan
    for ( const auto & [id, distance] : pair_vector ) {
        all_ids.push_back(id);
    }
    return all_ids;
}

void Datastructures::find_longest_path(TownID id)
{
    auto it = towns.find(id);
    auto vassal_ids = it->second.vassalid;

    comparison_path.push_back(id);

    if ( !it->second.vassalid.empty() ) {

        for ( auto &vassal_id : vassal_ids ) {
            find_longest_path(vassal_id);
        }
    }
    else if ( longest_path.size() < comparison_path.size() ) {
        longest_path = comparison_path;
    }
    comparison_path.pop_back();
    return;
}

int Datastructures::tax_calculator(TownID id)
{
    int tax = 0;
    auto it = towns.find(id);
    auto vassal_ids = it->second.vassalid;

    if ( !vassal_ids.empty() ) {

        for ( auto &vassal_id : vassal_ids ) {
            tax += floor( tax_calculator(vassal_id) * 0.1 );
        }
    }
    return it->second.tax + tax;
}
