#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <map>
#include <algorithm>

using namespace std;
using INFO = map<string, vector<string>>;


struct Product {
    string product_name;
    double price;
};

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

void save_stores(INFO &info, string chain, string store)
{
    if (info.find(chain) == info.end())
    {
        info.insert({chain, vector<string>()});
        info.at(chain).push_back(store);
    }
    else
    {
        vector<string> stores = info.at(chain);
        bool new_store = true;
        for(string member : stores)
        {
            if(member == store)
            {
                new_store = false;
            }
        }
        if (new_store)
        {
            info.at(chain).push_back(store);
        }
    }
}

void save_products(map<string, vector<string, Product*>> &info, vector<string> product_id, string price)
{
    double product_price = 0;

    if (price != "out-of-stock")
    {
        product_price = stod(price);
    }
    Product* product = Product({product_id.back(), product_price});

    if (info.find(product_id) == info.end())
    {
        info.insert({product_id, product});
    }
    else
    {
        info.at(product_id) = product;
    }
}

void print_chains_or_stores(INFO &info, string chain)
{
    if (chain == "")
    {
        for (auto pair : info)
        {
            cout << pair.first << endl;
        }
    }
    else
    {
        sort(info.at(chain).begin(), info.at(chain).end());
        for (string store : info.at(chain))
        {

            cout << store << endl;
        }
    }
}

int main()
{
    string file_name = "";
    cout << "Input file: ";
    getline(cin, file_name);

    ifstream file(file_name);

    if (not file)
    {
        cout << "Error: the input file cannot be opened" << endl;
        return EXIT_FAILURE;
    }
    else
    {
        map<string, vector<string>> stores;
        map<string, vector<string, Product*>> products;

        string row = "";

        while (getline(file, row))
        {
            // luetaan tiedoston rivi
            vector<string> splited_row = split(row, ';');
            if (splited_row.size() != 4)
            {
                cout << "Error: the input file has an erroneous line" << endl;
                return EXIT_FAILURE;
            }
            // tallennetaan tietorakenteeseen
            else
            {
                string chain = splited_row.at(0);
                string store = splited_row.at(1);
                string product = splited_row.at(2);
                string price = splited_row.at(3);

                save_stores(stores, chain, store);
            }
        }
        while (true)
        {
            string line;
            cout << "> ";
            getline(cin, line);
            vector<string> parts = split(line, ' ', true);

            string command = parts.at(0);

            if (command == "quit")
            {
                return EXIT_SUCCESS;
            }
            else if (command == "chains")
            {
                print_chains_or_stores(stores, "");
            }
            else if (command == "stores")
            {
                string chain = parts.at(1);
                if (stores.find(chain) == stores.end())
                {
                    cout << "Error: unknown chain name" << endl;
                }
                else
                {
                    print_chains_or_stores(stores, chain);
                }
            }
            else if (command == "selection")
            {
                // tuote ja hinta
            }
            else if (command == "cheapest")
            {
                // halvin hinta ja kaupat
            }
            else if (command == "products")
            {
                // kaikki tuotteet
            }
            else
            {
                cout << "Error: unknown command: " << command << endl;
            }
        }
    }
}

