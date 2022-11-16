// Datastructures.hh
//
// Student name: Julia Harttunen
// Student email: julia.harttunen@tuni.fi
// Student number: 291740

#ifndef DATASTRUCTURES_HH
#define DATASTRUCTURES_HH

#include <string>
#include <vector>
#include <map>
#include <unordered_map>
#include <tuple>
#include <utility>
#include <limits>
#include <functional>
#include <exception>
#include <algorithm>

// Types for IDs
using TownID = std::string;
using Name = std::string;

// Return values for cases where required thing was not found
TownID const NO_TOWNID = "----------";

// Return value for cases where integer values were not found
int const NO_VALUE = std::numeric_limits<int>::min();

// Return value for cases where name values were not found
Name const NO_NAME = "!!NO_NAME!!";

// Type for a coordinate (x, y)
struct Coord
{
    int x = NO_VALUE;
    int y = NO_VALUE;
};

// Type for a town
struct Town {
    TownID id;
    Name name;
    Coord coord;
    int tax;

    std::vector<TownID> vassalid;
    TownID masterid;
};

// Example: Defining == and hash function for Coord so that it can be used
// as key for std::unordered_map/set, if needed
inline bool operator==(Coord c1, Coord c2) { return c1.x == c2.x && c1.y == c2.y; }
inline bool operator!=(Coord c1, Coord c2) { return !(c1==c2); } // Not strictly necessary

struct CoordHash
{
    std::size_t operator()(Coord xy) const
    {
        auto hasher = std::hash<int>();
        auto xhash = hasher(xy.x);
        auto yhash = hasher(xy.y);
        // Combine hash values (magic!)
        return xhash ^ (yhash + 0x9e3779b9 + (xhash << 6) + (xhash >> 2));
    }
};

// Example: Defining < for Coord so that it can be used
// as key for std::map/set
inline bool operator<(Coord c1, Coord c2)
{
    if (c1.y < c2.y) { return true; }
    else if (c2.y < c1.y) { return false; }
    else { return c1.x < c2.x; }
}

// Return value for cases where coordinates were not found
Coord const NO_COORD = {NO_VALUE, NO_VALUE};

// Type for a distance (in metres)
using Distance = int;

// Return value for cases where Distance is unknown
Distance const NO_DISTANCE = NO_VALUE;

// This exception class is there just so that the user interface can notify
// about operations which are not (yet) implemented
class NotImplemented : public std::exception
{
public:
    NotImplemented() : msg_{} {}
    explicit NotImplemented(std::string const& msg) : msg_{msg + " not implemented"} {}

    virtual const char* what() const noexcept override
    {
        return msg_.c_str();
    }
private:
    std::string msg_;
};

// This is the class you are supposed to implement
class Datastructures
{
public:
    Datastructures();
    ~Datastructures();

    // Estimate of performance: O(1)
    // Short rationale for estimate: size on O(1).
    unsigned int town_count();

    // Estimate of performance: O(n)
    // Short rationale for estimate: clear on O(n).
    void clear_all();

    // Estimate of performance: O(logn)
    // Short rationale for estimate: find on O(logn), end on O(1), insert on (logn)
    // ja push_back on O(1) tai O(n), jos vektorissa ei ole tilaa.
    bool add_town(TownID id, Name const& name, Coord coord, int tax);

    // Estimate of performance: O(logn)
    // Short rationale for estimate: find on O(logn) ja end on O(1).
    Name get_town_name(TownID id);

    // Estimate of performance: O(logn)
    // Short rationale for estimate: find on O(logn) ja end on O(1).
    Coord get_town_coordinates(TownID id);

    // Estimate of performance: O(logn)
    // Short rationale for estimate: find on O(logn) ja end on O(1).
    int get_town_tax(TownID id);

    // Estimate of performance: O(1)
    // Short rationale for estimate: palauttaa vain vektorin.
    std::vector<TownID> all_towns();

    // Estimate of performance: O(n)
    // Short rationale for estimate: reserve on O(n), for on O(n) ja push_back on O(1).
    std::vector<TownID> find_towns(Name const& name);

    // Estimate of performance: O(logn)
    // Short rationale for estimate: find on O(logn) ja end on O(1).
    bool change_town_name(TownID id, Name const& newname);

    // Estimate of performance: O(nlogn)
    // Short rationale for estimate: reserve ja clear on O(n), sort on O(nlogn) ja for on O(n), jossa push_back on O(1)
    std::vector<TownID> towns_alphabetically();

    // Estimate of performance: O(nlogn)
    // Short rationale for estimate: make_distance_vector -funktion tehokkuus on O(nlogn).
    std::vector<TownID> towns_distance_increasing();

    // Estimate of performance: O(nlogn)
    // Short rationale for estimate: size on O(1), make_distance_vector -funktio on O(nlogn) ja front on O(1).
    TownID min_distance();

    // Estimate of performance: O(nlogn)
    // Short rationale for estimate: size on O(1), make_distance_vector -funktio on O(nlogn) ja back on O(1).
    TownID max_distance();

    // Estimate of performance: O(logn)
    // Short rationale for estimate: find on O(logn), end ja empty ovat O(1)
    // ja push_back on O(1) tai O(k), jos vektorissa ei ole paikkaa.
    bool add_vassalship(TownID vassalid, TownID masterid);

    // Estimate of performance: O(logn)
    // Short rationale for estimate: find on O(logn) ja end on O(1).
    std::vector<TownID> get_town_vassals(TownID id);

    // Estimate of performance: O(nlogn)
    // Short rationale for estimate: reserve on O(n), end, empty ja push_back ovat O(1),
    // while on O(n) ja sen sisältä löytyy find O(logn).
    std::vector<TownID> taxer_path(TownID id);

    // Non-compulsory phase 1 operations

    // Estimate of performance: O(klogn)
    // Short rationale for estimate: end on O(1), erase on O(n), for on O(k)
    // ja sen sisällä add_vassalship O(logn) ja find on O(logn).
    bool remove_town(TownID id);

    // Estimate of performance: O(nlogn)
    // Short rationale for estimate: make_distance_vector -funktion tehokkuus on O(nlogn).
    std::vector<TownID> towns_nearest(Coord coord);

    // Estimate of performance: O(nlogn)
    // Short rationale for estimate: reserve ja clear on O(n), find on O(logn),
    // end, push_back ja empty ovat O(1) ja find_longest_path on O(nlogn).
    std::vector<TownID> longest_vassal_path(TownID id);

    // Estimate of performance: O(klogn)
    // Short rationale for estimate: find on O(logn), end, empty ja ceil ovat O(1) ja tax_calculator on O(klogn).
    int total_net_tax(TownID id);

private:
    // Add stuff needed for your class implementation here
    std::unordered_map<TownID, Town> towns;
    std::vector<TownID> towns_vec;

    bool alphabetically;
    bool in_order;
    std::vector<TownID> order_vec;

    std::vector<TownID> longest_path;
    std::vector<TownID> comparison_path;

    // Estimate of performance: O(1)
    // Short rationale for estimate: floor, sqrt ja pow ovat O(1).
    // Funktio laskee ja palauttaa kaupungin etäisyyden origosta tai annetusta koordinaatista.
    int distance_calculator(Coord coord, Coord origin = {0,0});

    // Estimate of performance: O(nlogn)
    // Short rationale for estimate: reserve on O(n), for on O(n), jossa distance_calculator -funktio on O(1),
    // push_back on O(1) ja sort on O(nlogn).
    // Funktio palauttaa vektorin, jossa kaupunkien id:t ovat järjertyksessä etäisyyden mukaan.
    std::vector<TownID> make_distance_vector(Coord origin = {0,0});

    // Estimate of performance: O(nlogn)
    // Short rationale for estimate: for + rekursio on O(n), find on O(logn),
    // empty, size, pop_back ja push_back ovat O(1).
    // Funktio vertailee vassalien pituuksia ja muodostaa pisimmän reitin.
    void find_longest_path(TownID id);

    // Estimate of performance: O(klogn)
    // Short rationale for estimate: find on O(logn), empty ja floor tehokkuus ovat O(1)
    // ja for + rekursio tehokkuus on O(k).
    // Funktio laskee vassaleista saatavat verot ja palauttaa kokonaissumman.
    int tax_calculator(TownID id);
};

#endif // DATASTRUCTURES_HH
