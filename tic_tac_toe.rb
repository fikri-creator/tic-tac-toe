class Board
  attr_reader :cells

  def initialize
    # Membuat array isi 9 untuk merepresentasikan kotak 1 sampai 9
    @cells = (1..9).to_a
  end

  # Membaca papan ke terminal dengan format yang rapi
  def display
    puts "\n"
    puts " #{cells[0]} | #{cells[1]} | #{cells[2]} "
    puts "---+---+---"
    puts " #{cells[3]} | #{cells[4]} | #{cells[5]} "
    puts "---+---+---"
    puts " #{cells[6]} | #{cells[7]} | #{cells[8]} "
    puts "\n"
  end

  # Memperbarui isi kotak berdasarkan pilihan pemain
  def update_cell(position, symbol)
    @cells[position - 1] = symbol
  end

  # Mengecek apakah posisi yang dipilih masih kosong (berupa angka asli, bukan X/O)
  def valid_move?(position)
    position.between?(1, 9) && @cells[position - 1].is_a?(Integer)
  end

  # Mengecek semua kemungkinan kombinasi pemenang
  def win?
    winning_combinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], # Horizontal
      [0, 3, 6], [1, 4, 7], [2, 5, 8], # Vertical
      [0, 4, 8], [2, 4, 6]             # Diagonal
    ]

    winning_combinations.any? do |combo|
      @cells[combo[0]] == @cells[combo[1]] && @cells[combo[1]] == @cells[combo[2]]
    end
  end

  # Jika tidak ada angka tersisa dan belum ada yang win, berarti seri
  def tie?
    @cells.all? { |cell| cell.is_a?(String) } && !win?
  end
end

class Player
  attr_reader :name, :symbol

  def initialize(name, symbol)
    @name = name
    @symbol = symbol
  end
end

class Game
  def initialize
    @board = Board.new
    @player1 = Player.new("Pemain 1", "X")
    @player2 = Player.new("Pemain 2", "O")
    @current_player = @player1
  end

  # Alur utama game dijalankan di sini
  def play
    puts "=== SELAMAT DATANG DI GAME TIC-TAC-TOE ==="
    @board.display

    loop do
      take_turn
      @board.display

      if @board.win?
        puts "Selamat! 🎉 #{@current_player.name} (#{@current_player.symbol}) MENANG!"
        break
      elsif @board.tie?
        puts "Game Selesai! Pertandingan SERI! 🤝"
        break
      end

      switch_player
    end
  end

  private

  # Proses giliran pemain mengambil langkah
  def take_turn
    loop do
      print "#{@current_player.name} (#{@current_player.symbol}), pilih nomor kotak (1-9): "
      input = gets.chomp.to_i

      if @board.valid_move?(input)
        @board.update_cell(input, @current_player.symbol)
        break
      else
        puts "Pilihan tidak valid atau kotak sudah terisi! Coba lagi."
      end
    end
  end

  # Berganti giliran pemain setelah melangkah
  def switch_player
    @current_player = @current_player == @player1 ? @player2 : @player1
  end
end

# Menyalakan mesin game otomatis saat file dieksekusi
game = Game.new
game.play