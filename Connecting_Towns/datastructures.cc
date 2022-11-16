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
    roads_vec.clear();  // 2. vaihe O(t)
    in_order = false;
    alphabetically = false;
}

bool Datastructures::add_town(TownID id, const Name &name, Coord coord, int tax)
{
    auto it = towns.find(id);

    if ( it == towns.end() ) {
        struct Town new_town = {id, name, coord, tax, {}, NO_TOWNID, {}, NO_VALUE, NO_VALUE, NO_TOWNID, WHITE};
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
        // poistetaan kaupungista lähtevät tiet (2.vaihe)
        while ( !remove_it->second.neighbour_town.empty() ) {
            remove_road(id, remove_it->second.neighbour_town.back());
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


//
// Phase 2 operations
//


void Datastructures::clear_roads()
{
    for ( auto& town: towns ) {  // O(n)
        town.second.neighbour_town.clear(); // O(n)
    }
    roads_vec.clear(); // O(t)
}

std::vector<std::pair<TownID, TownID>> Datastructures::all_roads()
{
    return roads_vec; // O(1)
}

bool Datastructures::add_road(TownID town1, TownID town2)
{
    auto it1 = towns.find(town1);  // O(logn)
    auto it2 = towns.find(town2);   // O(logn)

    TownID smaller_id;
    TownID bigger_id;

    if ( it1 != towns.end() &&  it2 != towns.end() ) {  // O(1)

        // tarkastetaan kumpi on pienempi
        if ( town1 < town2 ) {
            smaller_id = town1;
            bigger_id = town2;
        }
        else {
            smaller_id = town2;
            bigger_id = town1;
        }
        // tarkastetaan löytyykö pari
        auto it = std::find_if(roads_vec.begin(), roads_vec.end(), [&](const auto& pair) {  // O(t)
            return (pair.first == smaller_id && pair.second == bigger_id);
        });
        // pari ei löytynyt, joten lisätään
        if ( it == roads_vec.end() ) {
            roads_vec.push_back({ smaller_id, bigger_id });  // O(1)
            it1->second.neighbour_town.push_back(town2);  // O(1)
            it2->second.neighbour_town.push_back(town1);
            return true;
        }
    }
    return false;
}

std::vector<TownID> Datastructures::get_roads_from(TownID id)
{
    auto it = towns.find(id);  // O(logn)

    if ( it != towns.end() ) {  // O(1)
        return it->second.neighbour_town;
    }
    std::vector<TownID> no_townid_vec = {NO_TOWNID};
    return no_townid_vec;
}

std::vector<TownID> Datastructures::any_route(TownID fromid, TownID toid)
{
    return least_towns_route(fromid, toid);  // O((n+t)log(n))
}

bool Datastructures::remove_road(TownID town1, TownID town2)
{
    auto it1 = towns.find(town1);  // O(logn)
    auto it2 = towns.find(town2);  // O(logn)

    TownID smaller_id;
    TownID bigger_id;

    if ( it1 != towns.end() && it2 != towns.end() ) {  // O(1)

        // tarkastetaan kumpi on pienempi
        if ( town1 < town2 ) {
            smaller_id = town1;
            bigger_id = town2;
        }
        else {
            smaller_id = town2;
            bigger_id = town1;
        }
        // tarkastetaan löytyykö pari
        auto it = std::find_if(roads_vec.begin(), roads_vec.end(), [&](const auto& pair) {  // O(t)
            return (pair.first == smaller_id && pair.second == bigger_id);
        });
        // poistetaan molempien structista ja naapuri vektoreista
        if ( it != roads_vec.end() ) {  // O(1)
            std::vector<TownID>::iterator position1 = std::find(it1->second.neighbour_town.begin(), it1->second.neighbour_town.end(), town2);  // O(t)
            std::vector<TownID>::iterator position2 = std::find(it2->second.neighbour_town.begin(), it2->second.neighbour_town.end(), town1);  // O(t)
            it1->second.neighbour_town.erase(position1);  // O(t)
            it2->second.neighbour_town.erase(position2);  // O(t)
            roads_vec.erase(it);  // O(t)
            return true;
        }
    }
    return false;
}

std::vector<TownID> Datastructures::least_towns_route(TownID fromid, TownID toid)
{
    auto fromit = towns.find(fromid);   // O(logn)
    auto toit = towns.find(toid);    // O(logn)

    std::vector<TownID> path;
    path.reserve(towns_vec.size());  // O(n)

    if ( fromit != towns.end() && toit != towns.end() ) {   // O(1)

        if ( BFS(fromid, toid) == false ) {  // O((n+t)log(n))
            return path;
        }
        path.push_back(toid); // O(1)

        while ( toit->second.path_back != NO_TOWNID ) { // O(n)
            path.push_back( toit->second.path_back );   // O(1)
            toit = towns.find(toit->second.path_back);  // O(logn)
        }
        // pitää kääntää
        reverse(path.begin(), path.end());  // O(n)
        return path;
    }
    path.push_back(NO_TOWNID);  // O(1)
    return path;
}

std::vector<TownID> Datastructures::road_cycle_route(TownID startid)
{
    auto startit = towns.find(startid); // O(logn)

    if ( startit != towns.end() ) {  // O(1)
        return DFS(startid);  // O((n+t)log(n))
    }
    std::vector<TownID> no_townid_vec = {NO_TOWNID};
    return no_townid_vec;
}

std::vector<TownID> Datastructures::shortest_route(TownID fromid, TownID toid)
{
    auto fromit = towns.find(fromid);  // O(logn)
    auto toit = towns.find(toid);   // O(logn)

    if ( fromit != towns.end() && toit != towns.end() ) {  // O(1)
        return Astar(fromid, toid);  // O((n+t)log(n+t))
    }
    std::vector<TownID> no_townid_vec = {NO_TOWNID};
    return no_townid_vec;
}

Distance Datastructures::trim_road_network()
{
    int total_distance = 0;

    // disjoint
    std::unordered_map<TownID, TownID> disjoint;

    for ( auto& town : towns_vec ) {  // O(n)
        disjoint.insert({ town, NO_TOWNID });  // O(1)
    }
    // tiet kaupunkeineen ja pituuksineen, prioriteettijono
    std::priority_queue<std::pair<int, std::pair<TownID, TownID>>> pq;

    for ( auto& road : roads_vec ) {  // O(t)
        Coord coord1 = towns.find(road.first)->second.coord;  // O(logn)
        Coord coord2 = towns.find(road.second)->second.coord;  // O(logn)
        pq.push({-(distance_calculator(coord1, coord2)), {road.first, road. second}});  // O(1), miinuksella saadaan oikeat ensin
    }

    while ( !pq.empty() ) {  // O(t)
        std::pair<int, std::pair<TownID, TownID>> shortest = pq.top();  // O(logt)
        pq.pop();   // O(logt)

        TownID town1 = shortest.second.first;
        TownID town2 = shortest.second.second;

        // kummastakaan ei lähde vielä tietä
        if ( disjoint.at(town1) == NO_TOWNID && disjoint.at(town2) == NO_TOWNID ) { // O(n)
            disjoint.at(town1) = town1;
            disjoint.at(town2) = town1;
            total_distance += shortest.first;
        }
        // 2:sta lähtee tie
        else if ( disjoint.at(town1) == NO_TOWNID && disjoint.at(town2) != NO_TOWNID ) {
            disjoint.at(town1) = town2;
            total_distance += shortest.first;
        }
        // 1:sta lähtee tie
        else if ( disjoint.at(town2) == NO_TOWNID && disjoint.at(town1) != NO_TOWNID ) {
            disjoint.at(town2) = town1;
            total_distance += shortest.first;
        }
        else {
            TownID town_1 = town1;
            TownID town_2 = town2;

            // etsitään pääjuuret
            while ( disjoint.at(town_1) != town_1 ) { // O(n)
                town_1 = disjoint.at(town_1); // O(n)
            }
            while ( disjoint.at(town_2) != town_2 ) {  // O(n)
                town_2 = disjoint.at(town_2);
            }
            if ( town_1 == town_2 ) {
                remove_road(town1, town2);  // O(logn)
            }
            else {
                // kaikille sama pääjuuri
                disjoint.at(town_2) = town1;
                total_distance += shortest.first;
            }
        }
    }
    // vaihdetaan takaisin positiiviseksi
    return -(total_distance);
}

bool Datastructures::BFS(TownID fromid, TownID toid)
{
    // leveys-ensin-haku BFS

    auto fromit = towns.find(fromid);   // O(logn)

    for (auto& town : towns ) {   // O(n)
        town.second.colour = WHITE;
        town.second.path_back = NO_TOWNID;
        town.second.d = std::numeric_limits<int>::max(); // ääretön
    }

    // muistilistana toimiva jonotietorakenne
    std::deque<TownID> queue;

    fromit->second.colour = GRAY;
    fromit->second.d = 0;
    queue.push_back(fromid);  // O(1)

    while ( !queue.empty() ) {      // O(n)
        TownID oldestid = queue.front();   // O(1)
        queue.pop_front();   // O(1)

        auto oldestit = towns.find(oldestid); // O(logn)
        for ( auto& neighbourid : oldestit->second.neighbour_town ) {   // O(t) t=tiet maksimissaan voi olla n²
            auto neighbourit = towns.find(neighbourid); // O(logn)

            if ( neighbourit->second.colour == WHITE ) {
                neighbourit->second.colour = GRAY;
                neighbourit->second.d = oldestit->second.d + 1;
                neighbourit->second.path_back = oldestid;
                queue.push_back(neighbourid);     // O(1)

                // katsotaan löytyikö määränpää
                if ( neighbourid == toid ) {
                    return true;
                }
            }
        }
        oldestit->second.colour = BLACK;
    }
    return false;
}

std::vector<TownID> Datastructures::DFS(TownID id)
{
    // syvyys-ensin-haku DFS

    for (auto& town : towns ) {  // O(n)
        town.second.colour = WHITE;
    }
    // muistilistana toimiva pinotietorakenne
    std::deque<TownID> stack;
    std::vector<TownID> no_vec;
    std::vector<TownID> path;
    path.reserve(towns_vec.size());  // O(n)

    stack.push_back(id); // O(1)

    while ( !stack.empty() ) {   // O(n)
        TownID latestid = stack.back();  // O(1)
        stack.pop_back();    // O(1)

        auto latestit = towns.find(latestid);   // O(logn)

        if ( latestit->second.colour == WHITE ) {
            latestit->second.colour = GRAY;
            stack.push_back(latestid);   // O(1)

            for ( auto& neighbourid : latestit->second.neighbour_town ) {    // O(t) t=tiet
                auto neighbourit = towns.find(neighbourid);   // O(logn)

                if ( neighbourit->second.colour == WHITE ) {
                    stack.push_back(neighbourid);    // O(1)
                }

                // silmukka
                else if ( neighbourit->second.colour == GRAY && path.back() !=  neighbourid) {
                    path.push_back(latestid);    // O(1)
                    path.push_back(neighbourid);  // O(1)
                    return path;
                }
            }
            path.push_back(latestid);   // O(1)
        }
        else {
            latestit->second.colour = BLACK;
            path.pop_back();   // O(1)
        }
    }
    return no_vec;
}

std::vector<TownID> Datastructures::Astar(TownID fromid, TownID toid)
{
    auto fromit = towns.find(fromid);   // O(logn)
    auto toit = towns.find(toid);   // O(logn)

    Coord to_coord = toit->second.coord;

    for (auto& town : towns ) {  // O(n)
        town.second.colour = WHITE;
        town.second.path_back = NO_TOWNID;
        // laitetaan negatiiviseksi, jotta saadaan oikeat luvut ensin
        town.second.d = -(std::numeric_limits<int>::max());
        town.second.de = -(std::numeric_limits<int>::max());
    }
    fromit->second.colour = GRAY;
    fromit->second.d = 0;

    // prioriteettijono
    std::priority_queue<std::pair<int, TownID>> pq;

    pq.push({ 0, fromid });

    // kuljettu reitti
    std::vector<TownID> path;
    path.reserve(towns.size());  // O(n)

    bool toid_found = false;

    while ( !pq.empty() ) {  // O(n)
        std::pair<int, TownID> nearest = pq.top();  // O(logn)
        pq.pop();  // O(logn)
        auto nearestit = towns.find(nearest.second);  // O(logn)

        // määränpää löydetty
        if ( nearest.second == toid ) {
            toid_found = true;
            break;
        }

        for ( auto& neighbourid : nearestit->second.neighbour_town ) {  // O(t)
            auto neighbourit = towns.find(neighbourid); // O(logn)
            bool relax_made = false;

            // Relax
            int road = distance_calculator(neighbourit->second.coord, nearestit->second.coord);  // O(1)
            if ( neighbourit->second.d < (nearestit->second.d - road) ) {
                neighbourit->second.d = nearestit->second.d - road;
                neighbourit->second.de = neighbourit->second.d - distance_calculator(to_coord, neighbourit->second.coord);  // O(1)
                neighbourit->second.path_back = nearest.second;
                relax_made = true;
            }

            if ( neighbourit->second.colour == WHITE ) {
                neighbourit->second.colour = GRAY;
                pq.push({ neighbourit->second.de, neighbourid });  // O(log(n+t))
            }
            else if ( relax_made ) {
                pq.push({ neighbourit->second.de, neighbourid });  // O(log(n+t))
            }
        }
        nearestit->second.colour = BLACK;
    }
    // muodostetaan reitti
    if ( toid_found == true ) {
        TownID id = toid;
        while ( id != NO_TOWNID ){
            path.push_back(id);   // O(1)
            id = towns.find(id)->second.path_back;   // O(n)
        }
        std::reverse(path.begin(), path.end());  // O(n)
    }
    return path;
}
