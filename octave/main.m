args = argv();
arglen = length(args);

for (i = 1:arglen) 
    name_value = strsplit(args{i}, ":");
    
    name = name_value{1};
    value = name_value{2};

    data.(name) = str2num(value);
end;

Va = data.va;
Vb = data.vb;

r1 = data.r1;
r2 = data.r2;
r3 = data.r3;
r4 = data.r4;
r5 = data.r5;

A = [1, 1, -1; r1 + r2, 0, r3; 0, r4 + r5, r3];
B = [0; Va; Vb];

x = A \ B;

printf("[%.10f, %.10f, %.10f]", x(1), x(2), x(3));