#include "array_operations.hh"

int greatest_v1(int* itemptr, int size) {

    int greatest = 0;

    for(int* i = itemptr; i < itemptr + size; ++i) {

        if (*i > greatest) {

            greatest = *i;
        }
    } return greatest;
}

int greatest_v2(int* itemptr, int* endptr) {
    int greatest = 0;

    for (int* i = itemptr; i < endptr; ++i) {

        if (*i > greatest) {
            greatest = *i;
        }
    }
    return greatest;
}

void copy(int* itemptr, int* endptr, int* targetptr) {

    int count = 0;

    for (int* i = itemptr; i < endptr +1; ++i) {
        int* a = targetptr + count;
        *a = *i;
        ++count;

    }
}
void reverse(int* leftptr, int* rightptr){

}
