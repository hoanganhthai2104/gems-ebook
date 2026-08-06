import json
import os

def create_nuoc_va_su_song_pages():
    """Create rich content pages for Nước và Sự Sống book"""
    
    header = """
<header class="mb-4">
    <span class="text-[11px] font-bold text-cyan-700 uppercase tracking-widest">Nền Y Học Sự Sống • Hoàng Anh</span>
    <h2 class="text-3xl serif-title mt-2 leading-tight text-[#1a2e35]">THẤU HIỂU ĐẠO CỦA NƯỚC</h2>
    <h3 class="text-lg font-semibold text-cyan-900 mt-1">Nước và Sự Sống • Hydrogen Ion Kiềm</h3>
    <div class="w-full h-px bg-gray-300 mt-4 opacity-50"></div>
</header>
"""
    
    pages = []
    
    # Page 1 - Cover/Intro
    pages.append(header + """<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<p class='mb-3'><strong>NƯỚC VÀ SỰ SỐNG</strong></p>
<p class='mb-3'>THẤU HIỂU ĐẠO CỦA NƯỚC & HYDROGEN ION KIỀM</p>
<p class='mb-3'>Tác giả: Chủ biên Hoàng Anh – Viện Y học Sự Sống</p>
</div>""")

    # Page 2 - TOC
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<h3 class='text-xl font-bold text-cyan-900 serif-title mt-4 mb-2'>MỤC LỤC</h3>
<p class='mb-3'>LỜI MỞ ĐẦU: Tại sao nước là chìa khóa của sự sống?</p>
<p class='mb-3'>CHƯƠNG 1: THẤU HIỂU ĐẠO CỦA NƯỚC</p>
<p class='mb-3'>  1.1 Nước trong vũ trụ và trên trái đất</p>
<p class='mb-3'>  1.2 Cấu trúc phân tử nước và đặc tính sinh học</p>
<p class='mb-3'>  1.3 Triết lý phương Đông về nước – Thủy hành trong ngũ hành</p>
<p class='mb-3'>  1.4 Đạo của nước theo Lão Tử – Thượng Thiện Nhược Thủy</p>
<p class='mb-3'>CHƯƠNG 2: VAI TRÒ CỦA NƯỚC TRONG CƠ THỂ CON NGƯỜI</p>
<p class='mb-3'>  2.1 Cơ thể người – 70% là nước</p>
<p class='mb-3'>  2.2 Nước và chức năng tế bào</p>
<p class='mb-3'>  2.3 Nước điều hòa nhiệt độ cơ thể</p>
<p class='mb-3'>  2.4 Nước và hệ thần kinh – não bộ</p>
<p class='mb-3'>CHƯƠNG 3: HYDROGEN ION KIỀM (HK) – NƯỚC CỦA SỰ SỐNG</p>
<p class='mb-3'>  3.1 pH và sức khỏe cơ thể</p>
<p class='mb-3'>  3.2 Hydrogen Ion – Chất chống oxy hóa mạnh nhất</p>
<p class='mb-3'>  3.3 Nước ion kiềm và cơ chế tái tạo tế bào</p>
<p class='mb-3'>  3.4 Nghiên cứu lâm sàng về nước Hydrogen</p>
<p class='mb-3'>CHƯƠNG 4: ỨNG DỤNG LIỆU PHÁP NƯỚC TRONG CHỮA LÀNH</p>
<p class='mb-3'>CHƯƠNG 5: XÂY DỰNG THÓI QUEN UỐNG NƯỚC ĐÚNG CÁCH</p>
<p class='mb-3'>KẾT LUẬN & PHỤ LỤC</p>
</div>""")

    # Page 3 - Intro
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<h3 class='text-xl font-bold text-cyan-900 serif-title mt-4 mb-2'>LỜI MỞ ĐẦU: Tại sao nước là chìa khóa của sự sống?</h3>
<p class='mb-3'>Trong suốt hành trình nghiên cứu và thực hành y học, một điều tôi nhận ra là: chúng ta đang sống trong một thế giới khát nước – không phải vì thiếu nước, mà vì chúng ta không thực sự hiểu về nước.</p>
<p class='mb-3'>Nước là thành phần chiếm tới 70% cơ thể người trưởng thành. Não bộ chứa 75% nước. Máu có tới 92% là nước. Nhưng hầu hết chúng ta chưa bao giờ thực sự suy nghĩ nghiêm túc về chất lỏng kỳ diệu này – loài người uống nó mỗi ngày nhưng gần như không hiểu gì về nó.</p>
<p class='mb-3'>Cuốn sách này ra đời từ một niềm tin sâu sắc: <em>nước không chỉ là nhu cầu sinh lý – nước là nền tảng của sự sống, là nguồn chữa lành và là con đường dẫn đến sức khỏe toàn diện.</em></p>
<p class='mb-3'>Trong hơn 30 năm nghiên cứu y học, tôi đã chứng kiến nhiều ca bệnh mãn tính được cải thiện đáng kể chỉ bằng cách thay đổi chất lượng và cách uống nước. Từ bệnh nhân tiểu đường, cao huyết áp, đến bệnh nhân ung thư giai đoạn đầu – nước đã và đang đóng một vai trò chữa lành mà ít ai để ý.</p>
<p class='mb-3'>Đặc biệt, với sự xuất hiện của nước Hydrogen Ion Kiềm (HK) – loại nước được tạo ra qua quá trình điện phân và ion hóa – chúng ta đang đứng trước một bước tiến mới trong y học phòng ngừa và chữa lành. Hydrogen (H₂) hòa tan trong nước đã được chứng minh là chất chống oxy hóa mạnh nhất trong tự nhiên, có khả năng trung hòa các gốc tự do nguy hiểm nhất gây lão hóa và ung thư.</p>
</div>""")

    # Page 4 - Chương 1
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<h3 class='text-xl font-bold text-cyan-900 serif-title mt-4 mb-2'>CHƯƠNG 1: THẤU HIỂU ĐẠO CỦA NƯỚC</h3>
<p class='mb-3'><strong>1.1 Nước trong vũ trụ và trên trái đất</strong></p>
<p class='mb-3'>Nước không chỉ là chất lỏng quen thuộc mà chúng ta sử dụng hàng ngày. Nước là điều kỳ diệu nhất trong vũ trụ – một phân tử đơn giản gồm hai nguyên tử hydro và một nguyên tử oxy (H₂O), nhưng lại mang trong mình những bí ẩn mà khoa học vẫn chưa giải mã hết.</p>
<p class='mb-3'>Trái đất được gọi là "hành tinh xanh" vì 71% bề mặt được bao phủ bởi nước. Nhưng đáng ngạc nhiên, chỉ 3% trong số đó là nước ngọt có thể sử dụng được, và phần lớn đang bị ô nhiễm. Trong khi đó, các nhà khoa học vẫn đang tìm kiếm dấu hiệu của nước trên sao Hỏa – bởi nơi nào có nước, nơi đó có sự sống.</p>
<p class='mb-3'>Điều này cho chúng ta thấy: <em>nước và sự sống là hai khái niệm không thể tách rời.</em></p>
<p class='mb-3'>Nước xuất hiện trên Trái đất khoảng 3.8 tỷ năm trước, và cũng từ đó, những dạng sống đầu tiên bắt đầu hình thành trong lòng đại dương nguyên sơ. Sự tiến hóa của sự sống gắn liền với sự tiến hóa của nước – từ vi khuẩn đơn bào đến con người hiện đại.</p>
</div>""")

    # Page 5 - Cấu trúc phân tử nước
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<p class='mb-3'><strong>1.2 Cấu trúc phân tử nước và đặc tính sinh học</strong></p>
<p class='mb-3'>Phân tử nước (H₂O) có cấu trúc đặc biệt: hai nguyên tử hydro liên kết với một nguyên tử oxy theo góc 104.5°. Hình dạng này tạo ra tính phân cực – một đầu mang điện dương (hydro) và một đầu mang điện âm (oxy).</p>
<p class='mb-3'>Chính tính phân cực này là lý do tại sao nước có nhiều tính chất đặc biệt:</p>
<p class='mb-3'>• <strong>Liên kết hydro:</strong> Các phân tử nước hút nhau tạo thành mạng lưới liên kết hydro. Đây là lý do nước có sức căng bề mặt cao, nước có thể leo lên trong cây cối ngược chiều trọng lực, và nước đá nổi trên nước lỏng (do liên kết hydro mở rộng khi đóng băng).</p>
<p class='mb-3'>• <strong>Dung môi phổ thông:</strong> Nước có thể hòa tan gần như mọi chất do tính phân cực. Đây là tại sao máu (95% là nước) có thể vận chuyển glucose, oxy, khoáng chất và hàng trăm loại chất khác đến mọi tế bào cơ thể.</p>
<p class='mb-3'>• <strong>Khả năng giữ nhiệt:</strong> Nước có nhiệt dung riêng cao – điều này giúp cơ thể người duy trì nhiệt độ ổn định dù môi trường thay đổi liên tục.</p>
<p class='mb-3'>• <strong>Trung gian của mọi phản ứng hóa học trong cơ thể:</strong> Không có phản ứng enzym, không có trao đổi chất, không có truyền tín hiệu thần kinh nào có thể xảy ra nếu không có nước.</p>
</div>""")

    # Page 6 - Triết lý phương Đông
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<p class='mb-3'><strong>1.3 Triết lý phương Đông về nước – Thủy hành trong ngũ hành</strong></p>
<p class='mb-3'>Trong triết học phương Đông, đặc biệt là trong hệ thống ngũ hành (Kim – Mộc – Thủy – Hỏa – Thổ), Thủy (nước) đóng vai trò đặc biệt quan trọng.</p>
<p class='mb-3'>Thủy hành tượng trưng cho:</p>
<p class='mb-3'>• <strong>Sự linh hoạt và thích nghi:</strong> Nước chảy vào mọi không gian, không cứng nhắc mà luôn tìm đường đi phù hợp với điều kiện.</p>
<p class='mb-3'>• <strong>Chiều sâu và trí tuệ:</strong> Trong y học cổ truyền, Thủy liên quan đến thận – cơ quan lưu giữ "tinh" (Jing) – bản chất di truyền và trí tuệ căn bản của con người.</p>
<p class='mb-3'>• <strong>Mùa Đông – Sự nghỉ ngơi và tái tạo:</strong> Thủy hành cai quản mùa đông, thời điểm thiên nhiên nghỉ ngơi và tích trữ năng lượng cho mùa xuân.</p>
<p class='mb-3'>• <strong>Màu đen và màu xanh thẫm:</strong> Màu sắc của chiều sâu, của đại dương và vũ trụ.</p>
<p class='mb-3'>Trong y học cổ truyền, khi Thủy hành suy yếu, thận và bàng quang dễ bị tổn thương, biểu hiện qua các triệu chứng như đau lưng, tiểu nhiều, rụng tóc, suy giảm sinh lý và lo âu quá mức.</p>
<p class='mb-3'>Từ góc nhìn này, "uống đủ nước" không chỉ là việc bổ sung chất lỏng đơn thuần, mà là hành động nuôi dưỡng Thủy hành, từ đó hỗ trợ thận, tăng cường tinh lực và kéo dài tuổi thọ.</p>
</div>""")

    # Page 7 - Đạo của nước
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<p class='mb-3'><strong>1.4 Đạo của nước theo Lão Tử – "Thượng Thiện Nhược Thủy"</strong></p>
<p class='mb-3'>Trong Đạo Đức Kinh, Lão Tử viết: <em>"上善若水" (Thượng thiện nhược thủy) – Điều thiện tốt nhất giống như nước."</em></p>
<p class='mb-3'>Đây là một trong những câu nói sâu sắc nhất về triết học sống. Lão Tử dạy rằng:</p>
<p class='mb-3'>• <strong>Nước làm lợi cho muôn vật mà không tranh giành:</strong> Nước luôn chảy về nơi thấp nhất – nơi mà con người thường không muốn đến. Đây là biểu tượng của sự khiêm tốn, phục vụ vô điều kiện.</p>
<p class='mb-3'>• <strong>Nước mềm mà thắng đá cứng:</strong> Qua nhiều năm tháng, nước có thể mài mòn đá tảng cứng nhất. Đây là bài học về sự kiên nhẫn, bền bỉ và sức mạnh của sự mềm mại.</p>
<p class='mb-3'>• <strong>Nước không có hình dạng cố định:</strong> Nước chứa trong bình thì thành hình bình, chứa trong chén thì thành hình chén. Đây là biểu tượng của sự linh hoạt, thích nghi – một phẩm chất quan trọng trong cuộc sống và trong chữa lành.</p>
<p class='mb-3'>• <strong>Nước thanh lọc và tẩy sạch:</strong> Nước rửa sạch mọi vết bẩn, và theo nghĩa bóng, nước cũng có thể thanh lọc tâm hồn – chính vì vậy mà hầu hết các tôn giáo đều sử dụng nước trong nghi lễ thanh tẩy.</p>
<p class='mb-3'>Triết lý về nước của Lão Tử không chỉ là bài học về đạo đức sống, mà còn là kim chỉ nam cho việc chữa lành: <em>hãy học cách trở nên mềm mại và linh hoạt như nước – đó là con đường dẫn đến sức khỏe thật sự.</em></p>
</div>""")

    # Page 8 - Chương 2
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<h3 class='text-xl font-bold text-cyan-900 serif-title mt-4 mb-2'>CHƯƠNG 2: VAI TRÒ CỦA NƯỚC TRONG CƠ THỂ CON NGƯỜI</h3>
<p class='mb-3'><strong>2.1 Cơ thể người – 70% là nước</strong></p>
<p class='mb-3'>Một trong những sự thật ít được nhận thức đúng mức là: cơ thể người không phải là máy thịt, xương cứng – mà là một "đại dương thu nhỏ" với 70% trọng lượng là nước.</p>
<p class='mb-3'>Phân bố nước trong cơ thể:</p>
<p class='mb-3'>• <strong>Não bộ:</strong> 75-85% là nước. Chỉ cần thiếu nước 2%, khả năng tập trung và phán đoán đã giảm đến 10%.</p>
<p class='mb-3'>• <strong>Máu:</strong> 92% là nước. Máu vận chuyển oxy, dưỡng chất, hormone và kháng thể đến mọi tế bào cơ thể.</p>
<p class='mb-3'>• <strong>Cơ bắp:</strong> 75% là nước. Đây là lý do cơ bắp cần được hydrat hóa tốt để hoạt động hiệu quả và phục hồi nhanh.</p>
<p class='mb-3'>• <strong>Xương:</strong> 22-25% là nước. Ít ai nghĩ xương cứng lại chứa nhiều nước, nhưng đây là sự thật.</p>
<p class='mb-3'>• <strong>Phổi:</strong> 90% là nước. Phổi cần độ ẩm để thực hiện trao đổi khí hiệu quả.</p>
<p class='mb-3'>Hàng ngày, cơ thể thải ra 2-3 lít nước qua nhiều con đường: hơi thở (300-400ml), mồ hôi (500-700ml), nước tiểu (1-1.5 lít), và phân (100-200ml). Tất cả lượng này cần được bổ sung để cơ thể duy trì chức năng bình thường.</p>
</div>""")

    # Page 9 - Chương 3 - Hydrogen
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<h3 class='text-xl font-bold text-cyan-900 serif-title mt-4 mb-2'>CHƯƠNG 3: HYDROGEN ION KIỀM – NƯỚC CỦA SỰ SỐNG</h3>
<p class='mb-3'><strong>3.1 pH và sức khỏe cơ thể</strong></p>
<p class='mb-3'>pH là thang đo độ axit/kiềm của dung dịch, từ 0 (axit mạnh nhất) đến 14 (kiềm mạnh nhất), với 7.0 là trung tính.</p>
<p class='mb-3'>Máu người cần duy trì pH rất chặt chẽ trong khoảng 7.35-7.45. Nếu vượt ra ngoài phạm vi này dù chỉ 0.1 đơn vị, cơ thể sẽ gặp nguy hiểm. Đây gọi là cân bằng acid-base – một trong những cơ chế điều hòa tinh vi nhất của cơ thể.</p>
<p class='mb-3'>Chế độ ăn hiện đại đang "acid hóa" cơ thể:</p>
<p class='mb-3'>• Thịt đỏ, đường tinh chế, nước ngọt có gas → tạo ra nhiều axit</p>
<p class='mb-3'>• Rau xanh, trái cây, nước kiềm → trung hòa và hỗ trợ cơ thể về phía kiềm</p>
<p class='mb-3'>Khi cơ thể trở nên quá acid (nhiễm toan), các vấn đề xuất hiện:</p>
<p class='mb-3'>• Mệt mỏi mãn tính, giảm miễn dịch</p>
<p class='mb-3'>• Đau nhức xương khớp (do cơ thể phải "lấy" canxi từ xương để trung hòa axit)</p>
<p class='mb-3'>• Tế bào ung thư phát triển tốt trong môi trường acid (pH thấp)</p>
<p class='mb-3'>• Lão hóa nhanh hơn</p>
</div>""")

    # Page 10 - Hydrogen
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<p class='mb-3'><strong>3.2 Hydrogen Ion – Chất chống oxy hóa mạnh nhất tự nhiên</strong></p>
<p class='mb-3'>Phân tử Hydrogen (H₂) là chất chống oxy hóa nhỏ nhất trong tự nhiên. Kích thước siêu nhỏ của nó cho phép nó đi vào mọi tế bào, kể cả não bộ (vượt qua hàng rào máu não) và ty thể – nhà máy năng lượng của tế bào.</p>
<p class='mb-3'>Trong cơ thể, các gốc tự do (free radicals) liên tục được tạo ra trong quá trình trao đổi chất bình thường, và nhiều hơn khi cơ thể bị stress, viêm nhiễm, hoặc tiếp xúc chất độc hại. Gốc tự do nguy hiểm nhất là Hydroxyl radical (•OH) – nó tấn công DNA, protein và màng tế bào, gây lão hóa và ung thư.</p>
<p class='mb-3'>H₂ + •OH → H₂O</p>
<p class='mb-3'>Phản ứng này đặc biệt quan trọng vì: Hydrogen trung hòa chính xác Hydroxyl radical độc hại nhất, và sản phẩm duy nhất tạo ra là nước – hoàn toàn vô hại.</p>
<p class='mb-3'>Điều này hoàn toàn khác với các chất chống oxy hóa khác như Vitamin C hay E, vốn có thể trở thành chất oxy hóa sau khi "dùng xong" và có thể gây tác dụng phụ nếu dùng liều cao.</p>
<p class='mb-3'><strong>Kết quả nghiên cứu lâm sàng cho thấy:</strong></p>
<p class='mb-3'>• Cải thiện tình trạng viêm và đau nhức</p>
<p class='mb-3'>• Hỗ trợ điều trị bệnh tiểu đường type 2</p>
<p class='mb-3'>• Bảo vệ thần kinh trong bệnh Parkinson và Alzheimer</p>
<p class='mb-3'>• Tăng cường phục hồi cơ bắp sau tập luyện</p>
<p class='mb-3'>• Cải thiện chất lượng da và làm chậm lão hóa</p>
</div>""")

    # Page 11 - Chương 4
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<h3 class='text-xl font-bold text-cyan-900 serif-title mt-4 mb-2'>CHƯƠNG 4: ỨNG DỤNG LIỆU PHÁP NƯỚC TRONG CHỮA LÀNH</h3>
<p class='mb-3'><strong>4.1 Liệu pháp nước trong y học cổ truyền</strong></p>
<p class='mb-3'>Y học cổ truyền đã sử dụng nước như một phương tiện chữa lành từ hàng ngàn năm trước:</p>
<p class='mb-3'>• <strong>Thủy trị liệu (Hydrotherapy):</strong> Sử dụng nước ở các nhiệt độ khác nhau để kích thích tuần hoàn, giảm viêm và phục hồi cơ thể. Phòng tắm lạnh/nóng xen kẽ là phương pháp đã được Hippocrates – cha đẻ của y học phương Tây – đề xuất từ 400 năm TCN.</p>
<p class='mb-3'>• <strong>Đắp nước nóng:</strong> Tăng tuần hoàn máu, giãn cơ, giảm đau tại chỗ</p>
<p class='mb-3'>• <strong>Đắp nước lạnh:</strong> Giảm viêm, hạ sốt, tăng sức đề kháng</p>
<p class='mb-3'>• <strong>Ngâm chân nước ấm:</strong> Kích hoạt hệ thần kinh phó giao cảm, giảm stress, cải thiện giấc ngủ</p>
<p class='mb-3'><strong>4.2 Liệu pháp nước muối sinh lý</strong></p>
<p class='mb-3'>Nước muối sinh lý (0.9% NaCl) có độ thẩm thấu bằng huyết tương người. Ứng dụng trong chữa lành:</p>
<p class='mb-3'>• Vệ sinh mũi họng, phòng ngừa nhiễm khuẩn đường hô hấp</p>
<p class='mb-3'>• Rửa mắt khi bị kích ứng hoặc dị vật</p>
<p class='mb-3'>• Súc miệng chống viêm lợi và nhiệt miệng</p>
<p class='mb-3'>• Vệ sinh vết thương ngoài da</p>
</div>""")

    # Page 12 - Chương 5
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<h3 class='text-xl font-bold text-cyan-900 serif-title mt-4 mb-2'>CHƯƠNG 5: XÂY DỰNG THÓI QUEN UỐNG NƯỚC ĐÚNG CÁCH</h3>
<p class='mb-3'><strong>5.1 Bao nhiêu nước là đủ?</strong></p>
<p class='mb-3'>Công thức phổ biến "8 ly nước mỗi ngày" thực ra không phải là con số chính xác cho tất cả mọi người. Nhu cầu nước phụ thuộc vào:</p>
<p class='mb-3'>• Cân nặng: 30-35ml nước/kg cân nặng/ngày là ngưỡng tổng quát</p>
<p class='mb-3'>• Mức độ hoạt động thể chất</p>
<p class='mb-3'>• Khí hậu và nhiệt độ môi trường</p>
<p class='mb-3'>• Tình trạng sức khỏe (có bệnh thận, tim không?)</p>
<p class='mb-3'><strong>5.2 Khi nào nên uống nước?</strong></p>
<p class='mb-3'>• <strong>Sau khi thức dậy:</strong> 300-500ml nước ấm (có thể pha chanh) để kích thích hệ tiêu hóa và thải độc sau giấc ngủ</p>
<p class='mb-3'>• <strong>30 phút trước bữa ăn:</strong> Kích thích men tiêu hóa và giảm cảm giác thèm ăn tự nhiên</p>
<p class='mb-3'>• <strong>Không uống nhiều trong bữa ăn:</strong> Tránh pha loãng dịch tiêu hóa</p>
<p class='mb-3'>• <strong>Trong và sau tập thể dục:</strong> Bổ sung liên tục để tránh mất nước</p>
<p class='mb-3'>• <strong>Trước khi ngủ:</strong> 200-300ml (tránh uống nhiều quá gây tiểu đêm)</p>
<p class='mb-3'><strong>5.3 Những sai lầm phổ biến khi uống nước</strong></p>
<p class='mb-3'>• Uống nước lạnh quá – co thắt mạch máu tiêu hóa</p>
<p class='mb-3'>• Uống nước có ga thay thế nước lọc</p>
<p class='mb-3'>• Đợi đến khi khát mới uống – khi khát cơ thể đã thiếu 1-2% nước</p>
<p class='mb-3'>• Uống quá nhiều nước một lúc – hạ natri máu nguy hiểm</p>
</div>""")

    # Final page
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<h3 class='text-xl font-bold text-cyan-900 serif-title mt-4 mb-2'>KẾT LUẬN</h3>
<p class='mb-3'>Nước không chỉ là một chất lỏng nuôi dưỡng cơ thể – nước là nền tảng của sự sống, là phương tiện chữa lành, và theo triết lý phương Đông, là biểu tượng của đức hạnh cao cả nhất.</p>
<p class='mb-3'>Cuốn sách này không kết thúc ở đây – nó chỉ là khởi đầu của hành trình khám phá. Hãy để mỗi ngụm nước bạn uống trở thành một hành động có ý thức – một sự kết nối với nguồn sống sâu thẳm nhất trong tự nhiên.</p>
<p class='mb-3'><em>"Thượng thiện nhược thủy" – Điều thiện tốt nhất giống như nước. Hãy sống, hãy chảy, hãy chữa lành – như nước.</em></p>
<p class='mb-3'>— Hoàng Anh, Viện Y học Sự Sống</p>
</div>
<div class='h-full overflow-y-auto bg-white px-5 py-6' id='quiz-container'><!-- Chapter Completed --></div>""")
    
    return pages


def create_tam_hoc_chua_lanh_pages():
    """Create rich content pages for Tâm Học Chữa Lành book"""
    
    header = """
<header class="mb-4">
    <span class="text-[11px] font-bold text-rose-700 uppercase tracking-widest">Nền Y Học Sự Sống • Hoàng Anh</span>
    <h2 class="text-3xl serif-title mt-2 leading-tight text-[#1a2e35]">TÂM HỌC & CHỮA LÀNH CẢM XÚC</h2>
    <h3 class="text-lg font-semibold text-rose-900 mt-1">Giải Phóng Cảm Xúc – Tái Lập Nội Tâm</h3>
    <div class="w-full h-px bg-gray-300 mt-4 opacity-50"></div>
</header>
"""
    
    pages = []
    
    # Page 1 - Cover
    pages.append(header + """<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<p class='mb-3'><strong>TÂM HỌC & CHỮA LÀNH CẢM XÚC</strong></p>
<p class='mb-3'>GIẢI PHÓNG CẢM XÚC – TÁI LẬP NỘI TÂM – NÂNG CAO NĂNG LƯỢNG SỐNG</p>
<p class='mb-3'>Tác giả: Chủ biên Hoàng Anh – Viện Y học Sự Sống</p>
</div>""")

    # Page 2 - TOC
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<h3 class='text-xl font-bold text-rose-900 serif-title mt-4 mb-2'>MỤC LỤC</h3>
<p class='mb-3'>LỜI NÓI ĐẦU: Khi cảm xúc là nguồn gốc của bệnh tật</p>
<p class='mb-3'>CHƯƠNG 1: TÂM HỌC – KHOA HỌC VỀ TÂM TRÍ VÀ CẢM XÚC</p>
<p class='mb-3'>  1.1 Tâm học là gì? – Ranh giới giữa tâm lý học và y học tâm thần</p>
<p class='mb-3'>  1.2 Não bộ và cảm xúc – Hệ limbic</p>
<p class='mb-3'>  1.3 Cảm xúc và sức khỏe thể chất – Cơ chế tâm thể</p>
<p class='mb-3'>  1.4 Bản đồ cảm xúc trong Y học Sự Sống</p>
<p class='mb-3'>CHƯƠNG 2: NHẬN DIỆN VÀ HIỂU CẢM XÚC</p>
<p class='mb-3'>  2.1 Cảm xúc tích cực và tiêu cực – Hiểu đúng về hai thái cực</p>
<p class='mb-3'>  2.2 Căng thẳng (stress) – Kẻ thù số một của sức khỏe</p>
<p class='mb-3'>  2.3 Nỗi sợ hãi – Gốc rễ của nhiều bệnh lý</p>
<p class='mb-3'>  2.4 Tức giận, oán hận và hệ quả lên cơ thể</p>
<p class='mb-3'>  2.5 Buồn bã và trầm cảm – Khi cảm xúc đóng băng</p>
<p class='mb-3'>CHƯƠNG 3: PHƯƠNG PHÁP CHỮA LÀNH CẢM XÚC</p>
<p class='mb-3'>  3.1 Thiền định – Nền tảng của mọi phương pháp chữa lành</p>
<p class='mb-3'>  3.2 Hít thở có ý thức – Công cụ tức thì điều hòa thần kinh</p>
<p class='mb-3'>  3.3 Viết nhật ký cảm xúc và liệu pháp diễn đạt</p>
<p class='mb-3'>  3.4 Tha thứ – Phương thuốc chữa lành mạnh nhất</p>
<p class='mb-3'>  3.5 Năng lượng học – Tần số cảm xúc và sức khỏe</p>
<p class='mb-3'>CHƯƠNG 4: XÂY DỰNG NỘI TÂM AN TĨNH BỀN VỮNG</p>
<p class='mb-3'>KẾT LUẬN & THỰC HÀNH</p>
</div>""")

    # Page 3 - Lời nói đầu
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<h3 class='text-xl font-bold text-rose-900 serif-title mt-4 mb-2'>LỜI NÓI ĐẦU: Khi cảm xúc là nguồn gốc của bệnh tật</h3>
<p class='mb-3'>Trong hơn 30 năm làm nghề, một điều tôi học được từ hàng nghìn bệnh nhân là: <em>phần lớn bệnh tật xuất phát từ cảm xúc chưa được giải quyết.</em></p>
<p class='mb-3'>Người phụ nữ 45 tuổi bị ung thư vú – "Tôi đã nuốt nỗi đau vào trong suốt 20 năm qua."</p>
<p class='mb-3'>Người đàn ông 52 tuổi bị nhồi máu cơ tim – "Tôi làm việc như một cái máy, không biết nghỉ ngơi là gì."</p>
<p class='mb-3'>Cô gái 28 tuổi bị viêm đại tràng mãn tính – "Tôi luôn lo lắng về mọi thứ, không bao giờ cảm thấy an toàn."</p>
<p class='mb-3'>Đây không phải là sự trùng hợp. Khoa học thần kinh và tâm lý học hiện đại đã chứng minh một cách thuyết phục: <strong>cảm xúc ảnh hưởng trực tiếp đến sinh lý cơ thể.</strong></p>
<p class='mb-3'>Cortisol – hormone stress – khi ở mức cao mãn tính sẽ phá hủy hệ miễn dịch, tàn phá tế bào não, thúc đẩy viêm nhiễm và gia tăng nguy cơ ung thư. Ngược lại, oxytocin và endorphin – hormone của tình yêu và hạnh phúc – có khả năng chữa lành và tăng cường miễn dịch mạnh mẽ.</p>
<p class='mb-3'>Cuốn sách này là lời mời gọi bạn bước vào hành trình chữa lành từ bên trong – không phải bằng thuốc, mà bằng cách nhận diện, hiểu và giải phóng những cảm xúc bị kẹt trong cơ thể.</p>
</div>""")

    # Page 4 - Chương 1
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<h3 class='text-xl font-bold text-rose-900 serif-title mt-4 mb-2'>CHƯƠNG 1: TÂM HỌC – KHOA HỌC VỀ TÂM TRÍ VÀ CẢM XÚC</h3>
<p class='mb-3'><strong>1.1 Tâm học là gì?</strong></p>
<p class='mb-3'>Tâm học trong hệ thống Y học Sự Sống không phải là tâm lý học thuần túy (psychology), cũng không phải là tâm thần học (psychiatry). Đây là một lĩnh vực tích hợp, kết hợp:</p>
<p class='mb-3'>• <strong>Khoa học thần kinh (Neuroscience):</strong> Nghiên cứu cơ chế não bộ trong việc xử lý cảm xúc</p>
<p class='mb-3'>• <strong>Tâm lý học (Psychology):</strong> Hiểu hành vi, tư duy và cảm xúc con người</p>
<p class='mb-3'>• <strong>Y học tâm thể (Psychosomatic Medicine):</strong> Mối liên hệ giữa tâm trí và thể chất</p>
<p class='mb-3'>• <strong>Triết học phương Đông:</strong> Khái niệm về tâm, thức, nghiệp và sự giải thoát</p>
<p class='mb-3'>• <strong>Y học năng lượng:</strong> Vai trò của tần số rung động cảm xúc đối với sức khỏe</p>
<p class='mb-3'><strong>1.2 Não bộ và cảm xúc – Hệ limbic</strong></p>
<p class='mb-3'>Não bộ con người có ba lớp tiến hóa:</p>
<p class='mb-3'>• <strong>Não bò sát (Reptilian Brain):</strong> Não thân – điều khiển các chức năng sinh tồn cơ bản: nhịp tim, hô hấp, thân nhiệt.</p>
<p class='mb-3'>• <strong>Não động vật có vú (Limbic System):</strong> Hệ viền – là "trung tâm cảm xúc" của não. Bao gồm hạch hạnh nhân (amygdala), vùng hải mã (hippocampus) và vùng dưới đồi (hypothalamus).</p>
<p class='mb-3'>• <strong>Vỏ não trước (Prefrontal Cortex):</strong> Phần não "người" – tư duy lý tính, ra quyết định, kiểm soát xung động.</p>
</div>""")

    # Page 5 - Stress
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<h3 class='text-xl font-bold text-rose-900 serif-title mt-4 mb-2'>CHƯƠNG 2: NHẬN DIỆN VÀ HIỂU CẢM XÚC</h3>
<p class='mb-3'><strong>2.2 Căng thẳng (stress) – Kẻ thù số một của sức khỏe</strong></p>
<p class='mb-3'>Stress không phải lúc nào cũng xấu. Stress cấp tính (acute stress) – như lo lắng trước một kỳ thi, hồi hộp trước một buổi thuyết trình – thực sự giúp chúng ta tập trung và hoạt động hiệu quả hơn. Đây gọi là eustress – stress có lợi.</p>
<p class='mb-3'>Vấn đề nằm ở <strong>stress mãn tính (chronic stress)</strong> – khi cơ thể liên tục ở trong trạng thái báo động. Các hệ quả của stress mãn tính:</p>
<p class='mb-3'>• <strong>Hệ miễn dịch:</strong> Cortisol cao mãn tính ức chế hoạt động của tế bào lympho và tế bào NK (Natural Killer) – hai loại chiến binh chính chống ung thư và nhiễm khuẩn.</p>
<p class='mb-3'>• <strong>Hệ tim mạch:</strong> Tăng nhịp tim, tăng huyết áp, tăng nguy cơ đau tim và đột quỵ.</p>
<p class='mb-3'>• <strong>Hệ tiêu hóa:</strong> Stress làm thay đổi nhu động ruột, giảm tiết enzym tiêu hóa, gây hội chứng ruột kích thích (IBS).</p>
<p class='mb-3'>• <strong>Não bộ:</strong> Cortisol cao phá hủy tế bào thần kinh vùng hải mã – gây mất trí nhớ và tăng nguy cơ Alzheimer.</p>
<p class='mb-3'>• <strong>Giấc ngủ:</strong> Stress làm rối loạn nhịp sinh học và giảm chất lượng giấc ngủ – hình thành vòng luẩn quẩn.</p>
<p class='mb-3'>Tổ chức Y tế Thế giới (WHO) gọi stress là "dịch bệnh của thế kỷ 21". Nghiên cứu cho thấy 75-90% tất cả các lần khám bệnh tại bệnh viện có liên quan đến stress.</p>
</div>""")

    # Page 6 - Sợ hãi, Tức giận
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<p class='mb-3'><strong>2.3 Nỗi sợ hãi – Gốc rễ của nhiều bệnh lý</strong></p>
<p class='mb-3'>Sợ hãi là cảm xúc nguyên thủy nhất của con người – một cơ chế sinh tồn được lập trình trong ADN từ hàng triệu năm tiến hóa. Hạch hạnh nhân (amygdala) – "trạm báo động" của não – kích hoạt phản ứng chiến đấu hoặc bỏ chạy (fight-or-flight) ngay cả khi nguy hiểm chỉ là tưởng tượng.</p>
<p class='mb-3'>Trong y học Sự Sống, sợ hãi mãn tính liên quan đến:</p>
<p class='mb-3'>• Thận yếu (theo y học cổ truyền – Thủy hành)</p>
<p class='mb-3'>• Hệ miễn dịch suy giảm</p>
<p class='mb-3'>• Rối loạn nội tiết (cortisol, adrenaline)</p>
<p class='mb-3'>• Lo âu, ám ảnh, PTSD (rối loạn stress sau sang chấn)</p>
<p class='mb-3'><strong>2.4 Tức giận, oán hận và hệ quả lên cơ thể</strong></p>
<p class='mb-3'>Tức giận là cảm xúc bình thường và lành mạnh khi được biểu đạt đúng cách. Vấn đề xảy ra khi tức giận bị đè nén, hay trở thành oán hận dai dẳng.</p>
<p class='mb-3'>Theo y học cổ truyền: <em>"Giận hại gan"</em> – và khoa học hiện đại đã xác nhận điều này:</p>
<p class='mb-3'>• Tức giận kích hoạt hệ giao cảm, tăng cortisol và adrenaline</p>
<p class='mb-3'>• Tức giận thường xuyên tăng nguy cơ bệnh tim mạch lên đến 300%</p>
<p class='mb-3'>• Oán hận lâu dài làm tổn hại hệ miễn dịch và thúc đẩy viêm nhiễm mãn tính</p>
<p class='mb-3'>Phương thuốc duy nhất cho oán hận là <strong>tha thứ</strong> – không phải vì người kia xứng đáng được tha thứ, mà vì <em>bạn xứng đáng được tự do.</em></p>
</div>""")

    # Page 7 - Phương pháp chữa lành
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<h3 class='text-xl font-bold text-rose-900 serif-title mt-4 mb-2'>CHƯƠNG 3: PHƯƠNG PHÁP CHỮA LÀNH CẢM XÚC</h3>
<p class='mb-3'><strong>3.1 Thiền định – Nền tảng của mọi phương pháp chữa lành</strong></p>
<p class='mb-3'>Thiền định không phải là việc "không suy nghĩ" – đó là một quan niệm sai lầm phổ biến. Thiền là khả năng <em>quan sát suy nghĩ mà không bị cuốn vào chúng.</em></p>
<p class='mb-3'>Nghiên cứu khoa học về thiền định trong 30 năm qua đã chứng minh:</p>
<p class='mb-3'>• Sau 8 tuần thiền chánh niệm (Mindfulness), thể tích hạch hạnh nhân (amygdala) – trung tâm sợ hãi – giảm rõ rệt</p>
<p class='mb-3'>• Thiền định làm dày vỏ não trước (prefrontal cortex), tăng khả năng kiểm soát cảm xúc và quyết định</p>
<p class='mb-3'>• Thiền giảm cortisol, tăng melatonin (hormone giấc ngủ) và tăng serotonin (hormone hạnh phúc)</p>
<p class='mb-3'>• Thiền làm thay đổi biểu hiện gen (epigenetics) – đặc biệt các gen liên quan đến viêm nhiễm</p>
<p class='mb-3'><strong>Hướng dẫn thiền cơ bản 10 phút:</strong></p>
<p class='mb-3'>1. Ngồi thoải mái, lưng thẳng, mắt nhắm nhẹ hoặc nhìn xuống</p>
<p class='mb-3'>2. Để ý đến hơi thở – không cần thay đổi, chỉ quan sát</p>
<p class='mb-3'>3. Khi tâm trí lang thang, nhẹ nhàng đưa sự chú ý trở lại hơi thở</p>
<p class='mb-3'>4. Lặp lại trong 10 phút. Đơn giản vậy thôi.</p>
</div>""")

    # Page 8 - Hít thở
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<p class='mb-3'><strong>3.2 Hít thở có ý thức – Công cụ tức thì điều hòa thần kinh</strong></p>
<p class='mb-3'>Hơi thở là cầu nối duy nhất giữa hệ thần kinh tự chủ (autonomic) và ý thức chủ động của con người. Trong khi tim đập, dạ dày tiêu hóa, gan giải độc… đều diễn ra ngoài ý thức, nhưng <strong>hơi thở vừa tự động vừa có thể điều khiển được.</strong></p>
<p class='mb-3'>Đây chính là "cửa hậu" để chúng ta can thiệp trực tiếp vào hệ thần kinh tự chủ – cụ thể là chuyển từ trạng thái giao cảm (stress, chiến đấu) sang phó giao cảm (nghỉ ngơi, chữa lành).</p>
<p class='mb-3'><strong>Kỹ thuật thở 4-7-8 (Dr. Andrew Weil):</strong></p>
<p class='mb-3'>• Thở ra hoàn toàn qua miệng tạo âm thanh "phù"</p>
<p class='mb-3'>• Ngậm miệng, hít vào qua mũi trong 4 giây</p>
<p class='mb-3'>• Nín thở trong 7 giây</p>
<p class='mb-3'>• Thở ra qua miệng trong 8 giây</p>
<p class='mb-3'>• Lặp lại 4 lần</p>
<p class='mb-3'>Hiệu quả: Kích hoạt dây thần kinh phế vị (vagus nerve), giảm nhịp tim, hạ huyết áp và cortisol trong vòng vài phút.</p>
<p class='mb-3'><strong>Kỹ thuật thở hộp (Box Breathing) – dùng bởi lính đặc nhiệm SEAL:</strong></p>
<p class='mb-3'>• Hít vào 4 giây → Nín thở 4 giây → Thở ra 4 giây → Nín thở 4 giây</p>
<p class='mb-3'>Sử dụng để lấy lại bình tĩnh trong tình huống căng thẳng cực độ.</p>
</div>""")

    # Page 9 - Tha thứ & Năng lượng
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<p class='mb-3'><strong>3.4 Tha thứ – Phương thuốc chữa lành mạnh nhất</strong></p>
<p class='mb-3'>Nghiên cứu từ Đại học Stanford cho thấy người học cách tha thứ có:</p>
<p class='mb-3'>• Huyết áp thấp hơn</p>
<p class='mb-3'>• Nhịp tim ổn định hơn</p>
<p class='mb-3'>• Hệ miễn dịch mạnh hơn</p>
<p class='mb-3'>• Mức độ trầm cảm và lo âu thấp hơn rõ rệt</p>
<p class='mb-3'>Tha thứ không có nghĩa là chấp nhận điều sai trái hay quên đi tổn thương. Tha thứ là <em>quyết định giải phóng bản thân khỏi gánh nặng của oán hận</em> – vì sự oán hận chỉ gây hại cho chính bạn, không phải cho người kia.</p>
<p class='mb-3'><strong>3.5 Thang tần số cảm xúc của David Hawkins</strong></p>
<p class='mb-3'>Dr. David Hawkins trong tác phẩm "Power vs. Force" đã đề xuất thang đo năng lượng cảm xúc:</p>
<p class='mb-3'>• Xấu hổ: 20 | Tội lỗi: 30 | Thờ ơ: 50 | Buồn bã: 75</p>
<p class='mb-3'>• Sợ hãi: 100 | Khao khát: 125 | Tức giận: 150</p>
<p class='mb-3'>• <strong>Tự nguyện: 250 | Chấp nhận: 350 | Yêu thương: 500</strong></p>
<p class='mb-3'>• Niềm vui: 540 | Bình an: 600 | Giác ngộ: 700+</p>
<p class='mb-3'>Những cảm xúc trên mức 200 (Tự nguyện) được coi là "chữa lành" – chúng hỗ trợ sức khỏe. Dưới mức 200 là "phá hủy" – gây bệnh theo thời gian.</p>
</div>""")

    # Page 10 - Chương 4
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<h3 class='text-xl font-bold text-rose-900 serif-title mt-4 mb-2'>CHƯƠNG 4: XÂY DỰNG NỘI TÂM AN TĨNH BỀN VỮNG</h3>
<p class='mb-3'><strong>4.1 Năm nền tảng của nội tâm khỏe mạnh</strong></p>
<p class='mb-3'>1. <strong>Tự nhận thức (Self-Awareness):</strong> Biết mình đang cảm thấy gì và tại sao – đây là bước đầu tiên không thể bỏ qua. Cảm xúc không thể được chữa lành nếu không được nhận diện.</p>
<p class='mb-3'>2. <strong>Chấp nhận (Acceptance):</strong> Chấp nhận thực tế như nó đang là – không phải là thụ động, mà là xuất phát điểm để thay đổi. Sức đề kháng đối với thực tế gây ra đau khổ nhiều hơn chính thực tế đó.</p>
<p class='mb-3'>3. <strong>Ranh giới lành mạnh (Healthy Boundaries):</strong> Biết nói "không" mà không cảm thấy tội lỗi. Ranh giới không phải là bức tường – đó là bộ lọc cho phép điều tốt vào và giữ điều độc hại ra.</p>
<p class='mb-3'>4. <strong>Kết nối (Connection):</strong> Cô đơn là một trong những nguyên nhân hàng đầu gây bệnh trong thế giới hiện đại. Nghiên cứu cho thấy cô đơn có hại cho sức khỏe tương đương hút 15 điếu thuốc mỗi ngày.</p>
<p class='mb-3'>5. <strong>Ý nghĩa và mục đích (Meaning & Purpose):</strong> Viktor Frankl, sau khi sống sót qua các trại tập trung Đức quốc xã, viết: "Người có lý do để sống có thể chịu đựng hầu hết mọi hoàn cảnh." Sức mạnh của mục đích sống là thuốc chữa bệnh mạnh nhất.</p>
</div>""")

    # Final page
    pages.append("""<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>
<h3 class='text-xl font-bold text-rose-900 serif-title mt-4 mb-2'>KẾT LUẬN</h3>
<p class='mb-3'>Hành trình chữa lành cảm xúc không phải là một đích đến – đó là một cách sống. Mỗi ngày, chúng ta có lựa chọn: sống trong trạng thái phản ứng và sợ hãi, hay sống trong trạng thái tỉnh thức và yêu thương.</p>
<p class='mb-3'>Cơ thể bạn luôn lắng nghe những gì tâm trí bạn nói. Hãy chọn những từ ngữ của yêu thương, tha thứ và hy vọng – cơ thể bạn sẽ đáp lại bằng sức khỏe.</p>
<p class='mb-3'><em>"Chữa lành không phải là trở thành người khác. Chữa lành là trở về với con người thật sự của bạn – trước khi nỗi đau và nỗi sợ che khuất nó."</em></p>
<p class='mb-3'>— Hoàng Anh, Viện Y học Sự Sống</p>
</div>
<div class='h-full overflow-y-auto bg-white px-5 py-6' id='quiz-container'><!-- Chapter Completed --></div>""")
    
    return pages


def update_chapters_json():
    chapters_path = os.path.join('d:\\Desktop\\EBOOK GEMS\\data', 'chapters.json')
    
    with open(chapters_path, 'r', encoding='utf-8') as f:
        chapters_data = json.load(f)

    # Add nuoc_va_su_song
    nuoc_pages = create_nuoc_va_su_song_pages()
    chapters_data['nuoc_va_su_song'] = {
        "title": "Nước và Sự Sống – Thấu Hiểu Đạo Của Nước & Hydrogen Ion Kiềm",
        "meta": "Nền Y Học Sự Sống • Tác giả Hoàng Anh",
        "pages": nuoc_pages
    }
    print(f"Added nuoc_va_su_song: {len(nuoc_pages)} pages")

    # Add tam_hoc_chua_lanh
    tam_pages = create_tam_hoc_chua_lanh_pages()
    chapters_data['tam_hoc_chua_lanh'] = {
        "title": "Tâm Học & Chữa Lành Cảm Xúc",
        "meta": "Nền Y Học Sự Sống • Tác giả Hoàng Anh",
        "pages": tam_pages
    }
    print(f"Added tam_hoc_chua_lanh: {len(tam_pages)} pages")

    with open(chapters_path, 'w', encoding='utf-8') as f:
        json.dump(chapters_data, f, ensure_ascii=False, indent=2)

    print("Successfully updated data/chapters.json with all 3 books!")
    
    # Show stats
    print("Book page counts:")
    for book_id, data in chapters_data.items():
        if isinstance(data, dict) and 'pages' in data:
            print(f"  {book_id}: {len(data['pages'])} pages")

if __name__ == '__main__':
    update_chapters_json()
