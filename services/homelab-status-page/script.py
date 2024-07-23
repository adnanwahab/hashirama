def file_to_dict(filename):
    result = {}
    current_key = None

    with open(filename, 'r') as file:
        for line in file:
            line = line.strip()
            if line.isdigit():
                current_key = int(line)
                result[current_key] = []
            elif line:
                result[current_key].append(line)

    return result

# Example usage
filename = 'wtf.json'
output = file_to_dict(filename)
print(output)
