#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <map>


const std::string HELP_TEXT = "S = store id1 i2\nP = print id\n"
                              "C = count id\nD = depth id\n";

using NETWORK = std::map<std::string, std::vector<std::string>>;

std::vector<std::string> split(const std::string& s, const char delimiter, bool ignore_empty = false){
    std::vector<std::string> result;
    std::string tmp = s;

    while(tmp.find(delimiter) != std::string::npos)
    {
        std::string new_part = tmp.substr(0, tmp.find(delimiter));
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

void store_n(NETWORK &n, std::string boss, std::string recruited) {

    if (n.find(boss) == n.end()) {
        n.insert({boss, std::vector<std::string>()});
    }
    n.at(boss).push_back(recruited);
}

void print_n(const NETWORK &n, std::string id, int depth) {

    for (int i = 0; i < depth; ++i) {
        std::cout << "..";
    }
    std::cout << id << std::endl;

    if (n.find(id) != n.end()) {
        for (auto person : n.at(id)) {
            print_n(n, person, depth +1);
        }
    }
}

int depth_n(const NETWORK &n, std::string id){

    int max_depth = 0;

    if (n.find(id) != n.end()) {

        for (auto person : n.at(id)) {
            int the_depth_of_this_one = depth_n(n, person);

            if (the_depth_of_this_one > max_depth) {
                max_depth = the_depth_of_this_one;
            }
        }
    }
    return max_depth + 1;
}

int count_n(const NETWORK &n, std::string id) {

    int amount = 0;

    if (n.find(id) != n.end()) {

        for (auto person : n.at(id)) {
            ++ amount;
            amount += count_n(n, person);
        }
    }
    return amount;
}

int main()
{
    // TODO: Implement the datastructure here

    std::map<std::string, std::vector<std::string>> network;

    while(true){
        std::string line;
        std::cout << "> ";
        getline(std::cin, line);
        std::vector<std::string> parts = split(line, ' ', true);

        std::string command = parts.at(0);

        if(command == "S" or command == "s"){
            if(parts.size() != 3){
                std::cout << "Erroneous parameters!" << std::endl << HELP_TEXT;
                continue;
            }
            std::string id1 = parts.at(1);
            std::string id2 = parts.at(2);

            // TODO: Implement the command here!
            store_n(network, id1, id2);


        } else if(command == "P" or command == "p"){
            if(parts.size() != 2){
                std::cout << "Erroneous parameters!" << std::endl << HELP_TEXT;
                continue;
            }
            std::string id = parts.at(1);

            // TODO: Implement the command here!
            print_n(network, id, 0);

        } else if(command == "C" or command == "c"){
            if(parts.size() != 2){
                std::cout << "Erroneous parameters!" << std::endl << HELP_TEXT;
                continue;
            }
            std::string id = parts.at(1);

            // TODO: Implement the command here!
            std::cout << count_n(network, id) << std::endl;

        } else if(command == "D" or command == "d"){
            if(parts.size() != 2){
                std::cout << "Erroneous parameters!" << std::endl << HELP_TEXT;
                continue;
            }
            std::string id = parts.at(1);

            // TODO: Implement the command here!
            std::cout << depth_n(network, id) << std::endl;

        } else if(command == "Q" or command == "q"){
           return EXIT_SUCCESS;
        } else {
            std::cout << "Erroneous command!" << std::endl << HELP_TEXT;
        }
    }
}
