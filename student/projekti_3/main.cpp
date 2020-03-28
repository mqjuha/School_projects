#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <map>
#include <set>
#include <algorithm>
#include <iomanip>

using namespace std;


struct Product {
    string product_name;
    double price;

    bool operator<(Product toinen) const{
        return product_name < toinen.product_name;
    }
};


// Miks -1? Saadaan double muoto
const double OUT_OF_STOCK = -1;


using Stores = map<string, vector<Product>>;
using Chains = map<string, Stores>;


// Copied from 6.3 Network
vector<string> split(const string& s, char delimiter, bool ignore_empty = false)
{
    vector<string> result;
    string tmp = s;

    while(tmp.find(delimiter) != string::npos)
    {
        string new_part = tmp.substr(0, tmp.find(delimiter));
        tmp = tmp.substr(tmp.find(delimiter)+1, tmp.size());
        if(not (ignore_empty and new_part.empty()))
        {
            result.push_back(new_part);
        }
    }
    if(not (ignore_empty and tmp.empty()))
    {
        result.push_back(tmp);
    }
    return result;
}


void insert_product(Chains& shopping_data, const string chain, const string store,
                    const string new_product_name, const double new_price){

    if (shopping_data.find(chain) == shopping_data.end()){
        shopping_data.insert( {chain, {} } );
    }

    if (shopping_data.at(chain).find(store) == shopping_data.at(chain).end()){
        shopping_data.at(chain).insert( {store, {} });
    }

    // suosittelee kuitenkin käyttämään settiä eli katsotaan onko samaa jotta saataisiin &
    for (auto& item: shopping_data.at(chain).at(store)) {

        if (item.product_name == new_product_name) {
            item.price = new_price;
            return;
        }
    }

    shopping_data.at(chain).at(store).push_back({new_product_name, new_price});

}


bool read_file(Chains& shoppin_data){

    cout<< "Input file: ";
    string file_name = "";
    getline(cin, file_name);

    ifstream file_object(file_name);

    if (not file_object){
        // Error
        return false;

    }
    string line = "";
    vector<string> line_parts = {};

    while(getline(file_object, line)){
        line_parts = split(line, ';');

        if (line_parts.size() != 4){
            // Error
            return false;
        }
        // No empty ones. No spaces in the strings

        double price = 0;

        if (line_parts.at(3) == "out-of-stock"){
            price = OUT_OF_STOCK;
        }else{
            price = stod(line_parts.at(3));
        }
        insert_product(shoppin_data, line_parts.at(0), line_parts.at(1),
                       line_parts.at(2), price);
    }
    file_object.close();
    return true;
}


void c_stores(const Chains& shoppin_data, const vector<string>& cmd_parts){

    if (cmd_parts.size() != 2){
        // Väärä määrä parametreja
        return;
    }

    string chain = cmd_parts.at(1);

    if (shoppin_data.find(chain) == shoppin_data.end()){
        // Unknow chain
        return;
    }

    for (auto& small_map_pair: shoppin_data.at(chain)){
        cout << small_map_pair.first << endl;
    }

}


int main(){

    Chains shopping_data;

    if (not read_file(shopping_data)){
        return EXIT_FAILURE;
    }

    while(true){

        cout << "> ";
        string command = "";
        getline(cin, command);

        vector<string> cmd_parts = split(command, ' ');
        // Ei oo tyhjä, tarkastus tulee tehdä
        string cmd = cmd_parts.at(0);

        if (cmd == "quit"){

            // Testaus miten saadaan desimaalit
            double a = 1.200;
            cout << setprecision(2)<< fixed << a << endl;

            return EXIT_SUCCESS;
        }
        else if(cmd == "stores"){
            c_stores(shopping_data, cmd_parts);

        }
    }


}
