import re

from jamo import j2h, j2hcj, h2j


# 노드 설정
class Node:
    def __init__(self, value):
        self.value = value
        self.data = []
        self.prefix_data = []
        self.suffix_data = []
        self.next = {}
# binary search 를 이용해 상품수 순으로 정렬해 삽입
    def data_insert(self, data, text):
        left = 0
        right = len(data)
        # while left < right:
        #     mid = (left+right) // 2
        #     if data[mid][1] == count:
        #         left = mid
        #         break
        #     else:
        #         if data[mid][1] < count:
        #             left = mid+1
        #         else:
        #             right = mid
        data.insert(left, text)
# prefix 기준으로 삽입후, 검색어가 10개 이상일 경우 -> 10개로 맞춰 제거
    def prefix_data_insert(self, text):
        data = self.prefix_data
        self.data_insert(data, text)
        # if len(self.prefix_data) > 10:
        #     self.prefix_data = self.prefix_data[-10:]
# suffix 기준으로 삽입후, 검색어가 10개 이상일 경우 -> 10개로 맞춰 제거
    def suffix_data_insert(self, text):
        data = self.suffix_data
        self.data_insert(data, text)
        # if len(self.suffix_data) > 10:
        #     self.suffix_data = self.suffix_data[-10:]

# 트라이 설정
class Trie:
    def __init__(self):
        self.head = Node(None)

    # 단어 삽입
    def insert(self, string):
        curr_node = self.head

        for word in string:
            if word not in curr_node.next:
                curr_node.next[word] = Node(word)
                curr_node.next[word].data.append(string)
            else:
                curr_node.next[word].data.append(string)
            curr_node = curr_node.next[word]

        curr_node.fin = string

    # 자동완성
    def auto_complete(self, string):
        curr_node = self.head

        for word in string:
            if word in curr_node.next:
                curr_node = curr_node.next[word]
            else:
                break
        return {"name": curr_node.data}

    def auto_complete_with_jamo(self, string):
        curr_node = self.head
        keyword = self.convert_kor_string_with_jamo(string)
        for word in keyword:
            if word in curr_node.next:
                curr_node = curr_node.next[word]
            else:
                break
        return {"name": curr_node.data}

    def insert_with_jamo(self, string: str):
        curr_node = self.head
        string_with_jamo = self.convert_kor_string_with_jamo(string)
        for word in string_with_jamo:
            if word not in curr_node.next:
                curr_node.next[word] = Node(word)
                curr_node.next[word].data.append(string)
            else:
                curr_node.next[word].data.append(string)
            curr_node = curr_node.next[word]

        curr_node.fin = string

    @staticmethod
    def convert_kor_string_with_jamo(text: str):
        return_value = ""
        for t in text:
            jamo_list = j2hcj(h2j(t))
            if len(jamo_list) == 2:
                return_value += jamo_list[0]
                return_value += j2h(*jamo_list)
            else:
                return_value += jamo_list[0]
                for i in range(2, len(jamo_list) + 1):
                    han = j2h(*jamo_list[:i])
                    return_value += han
        return return_value

    # Trie의 메소드
    def prefix_insert(self, eng_name):
        text = eng_name.lower()  # 대문자, 소문자 상관없이 검색을 위해 소문자로 일괄 변경
        curr = self.head
        for t in text:
            if t not in curr.next:
                curr.next[t] = Node(None)
            curr = curr.next[t]
            curr.prefix_data_insert(eng_name)

    def prefix_kor_insert(self, kor_name):
        text = self.convert_kor_string_with_jamo(kor_name)  # 한글을 초,중,종성으로 변경
        curr = self.head
        for t in text:
            if t not in curr.next:
                curr.next[t] = Node(None)
            curr = curr.next[t]
            curr.prefix_data_insert(kor_name)

    # Trie의 메소드
    def query_kor(self, text):
        kor_text = self.convert_kor_string_with_jamo(text)
        return self.query(kor_text)

    # Trie의 메소드
    def query(self, text):
        text = text.lower()
        curr = self.head
        for t in text:
            if t not in curr.next:
                break
            else:
                curr = curr.next[t]

        data = {}
        data["prefix_result"] = curr.prefix_data[::-1]
        data["suffix_result"] = curr.suffix_data[::-1]
        return data

    # Trie의 메소드
    def suffix_insert(self, text, name):
        text = text.lower()
        curr = self.head
        for t in text:
            if t not in curr.next:
                curr.next[t] = Node(None)
            curr = curr.next[t]
            curr.suffix_data_insert(name)

def nameTokenize(test_name):
    name_token_list = []
    for i in range(len(test_name)):
        if test_name[i] == " ": #띄어쓰기가 맨처음일 경우 건너뛰기
            continue
        name_token_list.append(test_name[i:])
    return name_token_list


def remove_other_than_korean(string: str):
    korean_pattern = re.compile('[ㄱ-ㅣ가-힣]+')
    korean_chars = korean_pattern.findall(string)
    return ''.join(korean_chars)
